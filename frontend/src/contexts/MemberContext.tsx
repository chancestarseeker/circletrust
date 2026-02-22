import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import client from "../api/client";
import type { Member } from "../types";

interface MemberContextValue {
  member: Member | null;
  loading: boolean;
  isTrusted: boolean;
  refetch: () => void;
}

const MemberContext = createContext<MemberContextValue>({
  member: null,
  loading: true,
  isTrusted: false,
  refetch: () => {},
});

export function MemberProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMember = useCallback(() => {
    if (!user) {
      setMember(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    client
      .get<Member>("/members/me")
      .then((res) => setMember(res.data))
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchMember();
    }
  }, [authLoading, fetchMember]);

  const isTrusted = member?.is_trusted ?? false;

  return (
    <MemberContext.Provider value={{ member, loading, isTrusted, refetch: fetchMember }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  return useContext(MemberContext);
}
