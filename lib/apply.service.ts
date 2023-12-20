import ApplyCv, { IApplyCv } from "../models/ApplyCv";
import ApplyMentor, { IApplyMentor } from "../models/ApplyMentor";

async function applyCv(form: Partial<IApplyCv>): Promise<IApplyCv> {
  return await ApplyCv.create(form);
}

async function applyMentor(form: Partial<IApplyMentor>): Promise<IApplyMentor> {
  return await ApplyMentor.create(form);
}

export { applyCv, applyMentor };
