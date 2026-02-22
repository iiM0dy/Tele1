import { getUsers } from "@/lib/user-actions";
import UsersClient from "./UsersClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const users = await getUsers();

    return <UsersClient users={users as any[]} />;
}
