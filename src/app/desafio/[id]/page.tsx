"use client"

import { API_URL } from "@/config";
import { protectPage } from "@/hooks/protect";
import { useAPI } from "@/hooks/useApi";
import { FormEvent, useState } from "react";

export default protectPage(function Page({ params: { id } }: { params: { id: string } }) {
    const [loading, setLoading] = useState<boolean>(false);

    const { data } = useAPI(API_URL + '/challenge/view/' + id, { method: 'GET' });
    const { refetch } = useAPI(API_URL + '/challenge/submit', { method: 'POST' }, false);

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);
            await refetch(new FormData(e.target as any));
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setLoading(false);
        }
    }

    if (!data)
        return null;

    return (
        <>
            <main className="flex items-center flex-col w-full md:w-1/2 mx-auto">
                <h1 className="mb-2 font-bold text-2xl mt-2">{data.title}</h1>

                <form onSubmit={submit} className="p-1 m-2">
                    <h1 className="w-full text-center text-xl font-medium">Enviar</h1>

                    <input type="hidden" name="challenge" value={id} />

                    <input type="file" name="file" accept=".alg" />

                    <input type="submit" value="Enviar" className="border-2 p-2 border-gray-500 rounded-md text-lg font-medium transition-colors hover:bg-gray-400" />
                </form>

                <div>
                    <h2 className="text-xl font-medium mb-1 mt-3">Descrição</h2>
                    <p>{data.description}</p>

                    <h2 className="text-xl font-medium mb-1 mt-3">Entrada de dados</h2>
                    <p>{data.inputDescription}</p>

                    <h2 className="text-xl font-medium mb-1 mt-3">Saída</h2>
                    <p>{data.outputDescription}</p>

                    <h2 className="text-xl font-medium mb-1 mt-3">Exemplos</h2>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="border-slate-500 border-[1px] border-b-0">Entrada</th>
                                <th className="border-slate-500 border-[1px] border-b-0 border-l-0">Saída</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.testerData.map((item: any) => (
                                <tr className="mt-1">
                                    <td className="border-slate-500 border-[1px] border-l-0 pl-1">
                                        <p className="block">
                                            {item.data.filter((d: any) => d.type == 'INPUT').map((d: any) => (
                                                <>
                                                    {d.value}
                                                    <br />
                                                </>
                                            ))}
                                        </p>
                                    </td>
                                    <td className="border-slate-500 border-[1px] border-x-0 pl-1">
                                        <p>
                                            {item.data.filter((d: any) => d.type == 'OUTPUT').map((d: any) => (
                                                <>
                                                    {d.value}
                                                    <br />
                                                </>
                                            ))}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
})
