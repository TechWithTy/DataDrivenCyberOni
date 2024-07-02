"use client"

import { ReactNode } from "react";
import { useNotify } from "../Notification";
import { Copy } from "lucide-react";

function CopyButton({ text, icon }: { text: string, icon: ReactNode }) {

    const notify = useNotify()

    return (

        <>
            <div>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(text)
                        notify("Copied to clipboard", "success")
                    }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                    {icon ? icon : <Copy />}
                </button>
            </div>
        </>
    )



}


export default CopyButton;