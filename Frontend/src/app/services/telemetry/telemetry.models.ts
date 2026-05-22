export interface SensorDeviceDto {
  sensorId: number;
  deviceType: string;
  assignedTo: string;
  assignedEntityId?: number;
  status: string;
}
export interface CreateSensorDeviceRequest { deviceType: string; assignedTo: string; assignedEntityId?: number; status?: string; }
export interface UpdateSensorDeviceRequest { deviceType: string; assignedTo: string; assignedEntityId?: number; status: string; }

export interface TelemetryRecordDto {
  telemetryId: number;
  sensorId: number;
  deviceType: string;
  timestamp: string;
  temperature?: number;
  humidity?: number;
  location?: string;
  isExcursion: boolean;
  excursionNote?: string;
}
export interface CreateTelemetryRecordRequest { sensorId: number; timestamp?: string; temperature?: number; humidity?: number; location?: string; }
export interface UpdateTelemetryRecordRequest { timestamp: string; temperature?: number; humidity?: number; location?: string; }
