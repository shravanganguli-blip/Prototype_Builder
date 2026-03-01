import { UseCaseId, PrototypeConfig } from "./journeys";

export interface SavedPrototype {
  id: string;
  createdAt: string;
  bankId: string;
  bankName: string;
  useCaseId: UseCaseId;
  useCaseName: string;
  config: PrototypeConfig;
}
