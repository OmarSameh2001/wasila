import SinglePolicyEditable from "@/app/(frontend)/_components/single_page/policy/policy";


export default function AdminSinglePolicy() {
    return (
        <div className="flex flex-col min-h-[70vh] justify-center items-center">
            <SinglePolicyEditable policies={{}}/>
        </div>
    );
}