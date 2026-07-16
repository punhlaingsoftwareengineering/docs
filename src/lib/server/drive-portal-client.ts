import {
	DRIVE_INTERNAL_ORIGIN,
	DRIVE_ORIGIN,
	DRIVE_STORAGE_PROVIDER,
	DRIVE_TEAM_API_KEY
} from '$app/env/private';
import { DOCS_DRIVE_CATEGORY, PORTAL_DRIVE_ROOT_FOLDER } from '$lib/constants/drive-media';

const SIMPLE_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;
const CHUNK_SIZE_BYTES = 8 * 1024 * 1024;

type DriveFileRow = {
	id: string;
	name: string;
	itemType: 'file' | 'folder';
	updatedAt?: string;
};

type DriveListResponse = { files: DriveFileRow[] };
type DriveUploadResponse = { ok: boolean; created: { id: string; name: string }[] };
type DriveChunkResponse = {
	uploadId: string;
	done: boolean;
	created?: { id: string; name: string }[];
};
type DriveFolderResponse = { ok: boolean; id: string; name: string };
type DrivePublicLinkResponse = {
	ok: boolean;
	fileDirectUrl?: string | null;
	shareUrl?: string;
};

export class DrivePortalNotConfiguredError extends Error {
	constructor() {
		super('DRIVE_TEAM_API_KEY is not configured');
		this.name = 'DrivePortalNotConfiguredError';
	}
}

export type PortalDriveMediaFile = {
	id: string;
	name: string;
	updatedAt: string | null;
};

let docsFolderCache: string | null = null;

function envString(key: string, fromModule: string | undefined): string | undefined {
	if (typeof fromModule === 'string' && fromModule.trim()) return fromModule.trim();
	const fromProcess = process.env[key];
	if (typeof fromProcess === 'string' && fromProcess.trim()) return fromProcess.trim();
	return undefined;
}

function drivePublicOrigin(): string {
	const origin = envString('DRIVE_ORIGIN', DRIVE_ORIGIN)?.replace(/\/$/, '');
	if (!origin) throw new DrivePortalNotConfiguredError();
	return origin;
}

function driveApiOrigin(): string {
	const internal = envString('DRIVE_INTERNAL_ORIGIN', DRIVE_INTERNAL_ORIGIN)?.replace(/\/$/, '');
	if (internal) return internal;
	return drivePublicOrigin();
}

function apiKey(): string {
	const key = envString('DRIVE_TEAM_API_KEY', DRIVE_TEAM_API_KEY);
	if (!key) throw new DrivePortalNotConfiguredError();
	return key;
}

function storageProvider(): 'local' | 'tigris' {
	const raw = envString('DRIVE_STORAGE_PROVIDER', DRIVE_STORAGE_PROVIDER)?.toLowerCase();
	if (raw === 'tigris') return 'tigris';
	return 'local';
}

export function buildDriveAuthHeaders(extra?: HeadersInit): Headers {
	const headers = new Headers(extra);
	headers.set('Authorization', `Bearer ${apiKey()}`);
	return headers;
}

export function absolutizeDriveUrl(url: string): string {
	if (/^https?:\/\//i.test(url)) return url;
	const origin = drivePublicOrigin();
	return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}

async function driveFetch(path: string, init?: RequestInit): Promise<Response> {
	const apiOrigin = driveApiOrigin();
	const headers = buildDriveAuthHeaders(init?.headers);
	const publicHost = new URL(drivePublicOrigin()).host;
	if (new URL(apiOrigin).host !== publicHost) {
		headers.set('Host', publicHost);
	}
	return fetch(`${apiOrigin}${path}`, { ...init, headers });
}

async function driveJson<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await driveFetch(path, init);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || `Drive API ${res.status}`);
	}
	return (await res.json()) as T;
}

async function listChildren(parentId: string | null): Promise<DriveFileRow[]> {
	const sp = storageProvider();
	const qs = new URLSearchParams({ storageProvider: sp });
	if (parentId) qs.set('parentId', parentId);
	const data = await driveJson<DriveListResponse>(`/api/drive/files?${qs}`);
	return data.files ?? [];
}

function findFolder(children: DriveFileRow[], name: string): DriveFileRow | undefined {
	return children.find((f) => f.itemType === 'folder' && f.name === name);
}

async function createFolder(name: string, parentId: string | null): Promise<string> {
	const sp = storageProvider();
	const body: Record<string, string> = { name, storageProvider: sp };
	if (parentId) body.parentId = parentId;
	const data = await driveJson<DriveFolderResponse>('/api/drive/folders', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	return data.id;
}

async function ensureFolder(parentId: string | null, name: string): Promise<string> {
	const children = await listChildren(parentId);
	const existing = findFolder(children, name);
	if (existing) return existing.id;
	const createdId = await createFolder(name, parentId);
	const afterCreate = await listChildren(parentId);
	const raced = findFolder(afterCreate, name);
	return raced?.id ?? createdId;
}

export async function ensureDocsMediaFolder(): Promise<string> {
	if (docsFolderCache) return docsFolderCache;
	const portalId = await ensureFolder(null, PORTAL_DRIVE_ROOT_FOLDER);
	const folderId = await ensureFolder(portalId, DOCS_DRIVE_CATEGORY);
	docsFolderCache = folderId;
	return folderId;
}

export async function listDocsMediaFiles(): Promise<PortalDriveMediaFile[]> {
	const folderId = await ensureDocsMediaFolder();
	const children = await listChildren(folderId);
	return children
		.filter((f) => f.itemType === 'file')
		.map((f) => ({
			id: f.id,
			name: f.name,
			updatedAt: f.updatedAt ?? null
		}));
}

export async function ensurePublicUrl(fileId: string): Promise<string> {
	const data = await driveJson<DrivePublicLinkResponse>(`/api/drive/files/${fileId}/public-link`, {
		method: 'POST'
	});
	const direct = data.fileDirectUrl?.trim();
	if (!direct) throw new Error('Drive did not return a public file URL');
	return absolutizeDriveUrl(direct);
}

async function uploadBytes(
	parentId: string,
	fileName: string,
	mimeType: string,
	bytes: Uint8Array
): Promise<string> {
	const sp = storageProvider();
	if (bytes.length <= SIMPLE_UPLOAD_MAX_BYTES) {
		const qs = new URLSearchParams({
			fileName,
			mimeType,
			storageProvider: sp,
			parentId
		});
		const data = await driveJson<DriveUploadResponse>(`/api/drive/upload?${qs}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/octet-stream' },
			body: Buffer.from(bytes)
		});
		const created = data.created?.[0];
		if (!created?.id) throw new Error('Drive upload did not return a file id');
		return created.id;
	}

	const chunkCount = Math.ceil(bytes.length / CHUNK_SIZE_BYTES);
	let uploadId: string | null = null;
	for (let i = 0; i < chunkCount; i++) {
		const start = i * CHUNK_SIZE_BYTES;
		const chunk = bytes.subarray(start, Math.min(start + CHUNK_SIZE_BYTES, bytes.length));
		const qs = new URLSearchParams({
			chunkIndex: String(i),
			chunkCount: String(chunkCount),
			storageProvider: sp
		});
		if (uploadId) qs.set('uploadId', uploadId);
		if (i === 0) {
			qs.set('fileName', fileName);
			qs.set('mimeType', mimeType);
			qs.set('parentId', parentId);
		}
		const data = await driveJson<DriveChunkResponse>(`/api/drive/upload/chunk?${qs}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/octet-stream' },
			body: Buffer.from(chunk)
		});
		uploadId = data.uploadId;
		if (data.done) {
			const created = data.created?.[0];
			if (!created?.id) throw new Error('Chunked upload did not return a file id');
			return created.id;
		}
	}
	throw new Error('Chunked upload did not complete');
}

export async function uploadDocsMedia(
	fileName: string,
	mimeType: string,
	bytes: Uint8Array
): Promise<{ id: string; name: string; url: string }> {
	const folderId = await ensureDocsMediaFolder();
	const fileId = await uploadBytes(folderId, fileName, mimeType, bytes);
	const url = await ensurePublicUrl(fileId);
	return { id: fileId, name: fileName, url };
}

export async function pickDocsMediaFile(
	fileId: string
): Promise<{ id: string; name: string; url: string }> {
	const files = await listDocsMediaFiles();
	const row = files.find((f) => f.id === fileId);
	if (!row) throw new Error('File not found in the documentation folder');
	const url = await ensurePublicUrl(fileId);
	return { id: fileId, name: row.name, url };
}
