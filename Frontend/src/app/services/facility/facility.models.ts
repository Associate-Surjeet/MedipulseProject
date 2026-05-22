export interface FacilityDto {
  facilityId: number;
  name: string;
  type?: string;
  region?: string;
}

export interface CreateFacilityRequest {
  name: string;
  type: string;
  region: string;
}

export interface UpdateFacilityRequest {
  name: string;
  type: string;
  region: string;
}

export interface StorageZoneDto {
  zoneId: number;
  facilityId?: number;
  facilityName: string;
  name?: string;
  temperatureProfile?: string;
  capacity?: number;
}

export interface CreateStorageZoneRequest {
  facilityId: number;
  name: string;
  temperatureProfile: string;
  capacity: number;
}

export interface UpdateStorageZoneRequest {
  name: string;
  temperatureProfile: string;
  capacity: number;
}
