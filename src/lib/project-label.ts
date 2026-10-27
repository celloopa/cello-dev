/** A project's eyebrow: whose work it is (client or my own product), then my role on it. */
export const projectEyebrow = ({ engagement, role }: { engagement?: string; role: string }) =>
  engagement ? `${engagement} · ${role}` : role;
