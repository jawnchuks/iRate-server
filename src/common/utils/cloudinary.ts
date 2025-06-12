import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
  TransformationOptions,
} from 'cloudinary';
import { ConfigService } from '@nestjs/config';

interface UploadOptions {
  userId?: string;
  folder?: string;
  transformation?: TransformationOptions[];
  resourceType?: 'image' | 'video' | 'raw';
}

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  private getFolderPath(options: UploadOptions): string {
    const baseFolder = 'iRate';
    if (options.userId) {
      return `${baseFolder}/users/${options.userId}/${options.folder || 'uploads'}`;
    }
    return `${baseFolder}/${options.folder || 'public'}`;
  }

  private getDefaultTransformations(): TransformationOptions[] {
    return [{ quality: 'auto' }, { fetch_format: 'auto' }];
  }

  async uploadImage(file: string, options: UploadOptions = {}): Promise<UploadApiResponse> {
    const folderPath = this.getFolderPath(options);
    const transformations = [
      ...this.getDefaultTransformations(),
      ...(options.transformation || []),
    ];

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file,
        {
          folder: folderPath,
          resource_type: options.resourceType || 'auto',
          transformation: transformations,
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  async uploadProfilePicture(file: string, userId: string): Promise<UploadApiResponse> {
    const transformations = [
      { width: 400, height: 400, crop: 'fill' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ];

    return this.uploadImage(file, {
      userId,
      folder: 'profile',
      transformation: transformations,
      resourceType: 'image',
    });
  }

  async uploadGalleryPhoto(file: string, userId: string): Promise<UploadApiResponse> {
    const transformations = [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ];

    return this.uploadImage(file, {
      userId,
      folder: 'gallery',
      transformation: transformations,
      resourceType: 'image',
    });
  }

  async uploadTemporaryPhoto(
    file: string,
    userId: string,
    uploadId: string,
  ): Promise<UploadApiResponse> {
    return this.uploadImage(file, {
      userId,
      folder: `temp/${uploadId}`,
      resourceType: 'image',
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: UploadApiErrorResponse | undefined) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async cleanupTemporaryFolder(userId: string, uploadId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.api.delete_resources_by_prefix(
        `iRate/users/${userId}/temp/${uploadId}`,
        (error: Error | undefined) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
      );
    });
  }
}
