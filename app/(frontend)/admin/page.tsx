import Link from "next/link";


export default function AdminPage(){
    return (
        <div className="flex flex-col min-h-[70vh] justify-center items-center">
            <h1 className="text-2xl font-bold">Welcome Admin</h1>
            <div className="flex gap-10 mt-5 sm:flex-row flex-col">
                <Link href="/admin/policy">Policies</Link>
                <Link href="/admin/client">Clients</Link>
                <Link href="/admin/record">Records</Link>
                <Link href="/admin/broker">Brokers</Link>
                <Link href="/admin/setting">Settings</Link>
            </div>
        </div>
    );
}