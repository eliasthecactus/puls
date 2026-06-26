import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';
import { api } from './api';
import type { User } from '@/types';

export async function registerPasskey(username: string, displayName: string): Promise<User> {
  const options = await api.startRegistration(username, displayName);
  const credential = await startRegistration(options as unknown as PublicKeyCredentialCreationOptionsJSON);
  const result = await api.finishRegistration(credential);
  if (!result.verified) throw new Error('Registrierung fehlgeschlagen');
  return result.user;
}

export async function loginPasskey(username: string): Promise<User> {
  const options = await api.startLogin(username);
  const credential = await startAuthentication(options as unknown as PublicKeyCredentialRequestOptionsJSON);
  const result = await api.finishLogin(credential);
  if (!result.verified) throw new Error('Anmeldung fehlgeschlagen');
  return result.user;
}
