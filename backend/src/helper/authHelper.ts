import ClientInviteToken from "../models/ClientInviteToken";

export const isValidProfileType = (value: any): value is 'trainer' | 'client' => {
    return value === 'trainer' || value === 'client';
}

export async function validateInvite(inviteToken: string) {
    const invite = await ClientInviteToken.findOne({ inviteToken });
    
    if (!invite) {
        throw new Error("Invalid token");
    }
    
    if (invite.expiresAt < new Date()) {
        throw new Error("Expired token");
    }
    
    if (invite.usedAt) {
        throw new Error("Token already used");
    }
    
    return invite; // return the valid invite
}
