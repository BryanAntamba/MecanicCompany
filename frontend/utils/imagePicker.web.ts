/**
 * Wrapper para expo-image-picker compatible con web
 */

export enum MediaTypeOptions {
  All = 'All',
  Images = 'Images',
  Videos = 'Videos',
}

export interface ImagePickerOptions {
  mediaTypes?: MediaTypeOptions;
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  base64?: boolean;
}

export interface ImagePickerResult {
  canceled: boolean;
  assets?: Array<{
    uri: string;
    width?: number;
    height?: number;
    type?: string;
    base64?: string;
  }>;
}

export const launchImageLibraryAsync = async (
  options?: ImagePickerOptions
): Promise<ImagePickerResult> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event: any) => {
      const file = event.target.files?.[0];
      
      if (!file) {
        resolve({ canceled: true });
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const uri = e.target?.result as string;
        
        resolve({
          canceled: false,
          assets: [{
            uri,
            type: file.type,
            base64: options?.base64 ? uri.split(',')[1] : undefined,
          }],
        });
      };
      
      if (options?.base64) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsDataURL(file);
      }
    };
    
    input.oncancel = () => {
      resolve({ canceled: true });
    };
    
    input.click();
  });
};

export const requestMediaLibraryPermissionsAsync = async () => {
  return { granted: true, status: 'granted' as const };
};

export const requestCameraPermissionsAsync = async () => {
  return { granted: true, status: 'granted' as const };
};
