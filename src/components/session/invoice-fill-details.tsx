"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SelectNative } from "@/components/ui/select-native";
import { CountriesList, CountriesListType } from "@/constants/Countries";
import { fetchSupportedCountries, getMatchedCountries } from "@/components/session/subscription-utils";

interface InvoiceFillDetailsProps {
    url: string;
}

export function InvoiceFillDetails({ url }: InvoiceFillDetailsProps) {
    const [countries, setCountries] = useState<CountriesListType[]>([]);
    const [isLoadingCountry, setIsLoadingCountry] = useState(false);
    const [address, setAddress] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [postalCode, setPostalCode] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingCountry(true);
            const countryCodes = await fetchSupportedCountries();
            const matchedCountries = await getMatchedCountries(countryCodes, CountriesList);
            setCountries(matchedCountries);
            setIsLoadingCountry(false);
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="space-y-0 rounded-xl border border-border-secondary">
                <div className="space-y-2">
                    <SelectNative className="rounded-b-none shadow-none focus-visible:relative focus-visible:z-20" disabled={isLoadingCountry}>
                        {isLoadingCountry ? (
                            <option value="">Loading...</option>
                        ) : (
                            countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))
                        )}
                    </SelectNative>
                </div>
                <div className="border-border-secondary">
                    <Input
                        className="rounded-t-none rounded-b-none border-t-0 focus-visible:relative focus-visible:border-t focus-visible:z-20"
                        type="text"
                        placeholder="Address line 1"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="border-border-secondary">
                    <Input
                        className="rounded-t-none border-y-0 rounded-b-none focus-visible:relative focus-visible:border-t focus-visible:z-20"
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-0 border-t border-border-secondary">
                    <div className="">
                        <Input
                            className="rounded-none rounded-bl-lg focus-visible:relative focus-visible:border-y focus-visible:z-20"
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="">
                        <Input
                            className="rounded-none rounded-br-lg border-l-0  focus-visible:relative focus-visible:border-y focus-visible:border-l focus-visible:z-20"
                            type="text"
                            placeholder="Postal code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex mt-4">
                <Button className="w-full" variant="default" onClick={() => window.open(url, '_blank')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                </Button>
            </div>
        </div>
    );
}

export default InvoiceFillDetails;


