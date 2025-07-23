import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";

export default function AdminDashboard() {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        domain: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
    });

    const submit = (e) => {

        post('/create-merchant', {
            onSuccess: () => {
                reset();
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex flex-col gap-5">
                            <div>
                                <InputLabel value='Name' />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel value='Domain' />
                                <TextInput
                                    id="domain"
                                    type="text"
                                    name="domain"
                                    value={data.domain}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('domain', e.target.value)}
                                />
                            </div>

                            <div>
                                <InputLabel value='Admin Name' />
                                <TextInput
                                    id="admin_name"
                                    type="text"
                                    name="admin_name"
                                    value={data.admin_name}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('admin_name', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel value='Admin Email' />
                                <TextInput
                                    id="admin_email"
                                    type="email"
                                    name="admin_email"
                                    value={data.admin_email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('admin_email', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel value='Admin Password' />
                                <TextInput
                                    id="admin_password"
                                    type="email"
                                    name="admin_password"
                                    value={data.admin_password}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('admin_password', e.target.value)}
                                />
                            </div>


                            <div>
                                <PrimaryButton onClick={submit}>Submit</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}