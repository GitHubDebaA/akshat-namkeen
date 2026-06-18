"use client";

import { useState } from "react";
import { X, Save, CircleAlert, House, Building2, MapPinHouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAddressOptions } from "@/store/address/address";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"

export default function AddAddress() {
    const { closeAddressOptions, setPageName } = useAddressOptions();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: "",
        state: "",
        country: "India",

        fullName: "",
        mobile: "",
        addressType: "HOME",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/address/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            toast.success("Address saved successfully", {
                position: "bottom-left",
                style: {
                    background: "#111827",
                    color: "#fff",
                    border: "1px solid #374151",
                },
            });

            setPageName('view');
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save address",
                {
                    position: "bottom-left",
                    style: {
                        background: "#fe0e0e",
                        color: "#fff",
                        border: "1px solid #cf6a17",
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Section @@Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-200">
                <div className="flex items-center gap-3">
                    <h2 className="font-display text-lg font-medium">Add New Address</h2>
                </div>
                <button
                    onClick={closeAddressOptions}
                    className="p-2 rounded-full hover:bg-brand-100 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Section @@Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                {/* Section @@Address Form */}
                <form>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Delivery to</FieldLegend>
                            <FieldDescription>Add new delivery location</FieldDescription>

                            <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                                <CircleAlert />
                                <AlertDescription>
                                    Ensure your address details are accurate for a smooth delivery experience
                                </AlertDescription>
                            </Alert>

                            <FieldGroup>
                                <Field>
                                    {/* <FieldLabel htmlFor="address-line-01"><span className="text-destructive">*</span>Flat/House/Building Name</FieldLabel> */}
                                    <Input id="addressLine1" placeholder="Flat/House/Building Name" value={formData.addressLine1} onChange={handleChange} required></Input>
                                </Field>
                                <Field>
                                    {/* <FieldLabel htmlFor="address-line-02"><span className="text-destructive">*</span>Area/Sector/Locality</FieldLabel> */}
                                    <Input id="addressLine2" placeholder="Area/Sector/Locality" value={formData.addressLine2} onChange={handleChange} required></Input>
                                </Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        {/* <FieldLabel htmlFor="address-line-02"><span className="text-destructive">*</span>Area/Sector/Locality</FieldLabel> */}
                                        <Input id="city" placeholder="City" value={formData.city} onChange={handleChange} required></Input>
                                    </Field>
                                    <Field>
                                        {/* <FieldLabel htmlFor="address-line-02"><span className="text-destructive">*</span>Area/Sector/Locality</FieldLabel> */}
                                        <Input id="postalCode" placeholder="Pincode" value={formData.postalCode} onChange={handleChange} required></Input>
                                    </Field>
                                    <Field>
                                        {/* <FieldLabel htmlFor="address-line-02"><span className="text-destructive">*</span>Area/Sector/Locality</FieldLabel> */}
                                        <Input id="state" placeholder="State" value={formData.state} onChange={handleChange} required></Input>
                                    </Field>
                                    <Field>
                                        {/* <FieldLabel htmlFor="address-line-02"><span className="text-destructive">*</span>Area/Sector/Locality</FieldLabel> */}
                                        <Input id="country" placeholder="Country" value="India" disabled required></Input>
                                    </Field>
                                </div>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    {/* <FieldLabel htmlFor="full-name"><span className="text-destructive">*</span>Enter your full name</FieldLabel> */}
                                    <Input id="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required></Input>
                                </Field>
                                <Field>
                                    {/* <FieldLabel htmlFor="mobile-number"><span className="text-destructive">*</span>10-digit mobile number</FieldLabel> */}
                                    <Input id="mobile" placeholder="10-digit mobile number" value={formData.mobile} onChange={handleChange} required></Input>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSeparator />
                        <FieldLabel>Type of address</FieldLabel>
                        <ToggleGroup
                            variant="outline"
                            value={[formData.addressType]}
                            onValueChange={(values) => {
                                setFormData(prev => ({
                                    ...prev,
                                    addressType: values[0] || "HOME",
                                }));
                            }}
                        >
                            <ToggleGroupItem value="HOME" className="data-[pressed]:bg-project_primary data-[pressed]:text-white data-[pressed]:border-project_primary data-[pressed]:shadow-md data-[pressed]:scale-[1.02] transition-all duration-200">
                                <House />
                                Home
                            </ToggleGroupItem>
                            <ToggleGroupItem value="OFFICE" className="data-[pressed]:bg-project_primary data-[pressed]:text-white data-[pressed]:border-project_primary data-[pressed]:shadow-md data-[pressed]:scale-[1.02] transition-all duration-200">
                                <Building2 />
                                Office
                            </ToggleGroupItem>
                            <ToggleGroupItem value="OTHER" className="data-[pressed]:bg-project_primary data-[pressed]:text-white data-[pressed]:border-project_primary data-[pressed]:shadow-md data-[pressed]:scale-[1.02] transition-all duration-200">
                                <MapPinHouse />
                                Other
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </FieldGroup>
                </form>
            </div>

            {/* Section @@Footer */}
            <div className="px-6 py-5 border-t border-brand-200 space-y-4">
                <Button
                    type="button"
                    disabled={loading}
                    onClick={handleSave}
                    className="text-sm w-full py-6 bg-project_primary hover:bg-project_primary-foreground text-white transition-colors cursor-pointer uppercase"
                >
                    {
                        loading ?
                            <>
                                <Spinner />
                                Saving address...
                            </>
                            :
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save address
                            </>
                    }
                </Button>
            </div>
        </>
    );
}