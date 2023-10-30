"use client"

import { API_URL } from "@/config";
import { protectPage } from "@/hooks/protect";
import { useAPI } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default protectPage(function Page() {
    const [page, setPage] = useState<number>(1);

    const { data, refetch, loading } = useAPI(API_URL + '/challenge/paginator' + '?page=' + page.toString(), { method: 'GET' }, true);
    const { push } = useRouter();

    const redirectChallenge = (challengeId: string) => {
        push(`/desafio/${challengeId}`);
    }

    useEffect(() => { refetch(); }, [page]);

    return (
        <>
            <main className="flex items-center flex-col w-full">
                <h1 className="mb-2 font-bold text-2xl">Desafios</h1>

                {data && data.challenges.map((item: any) => (
                    <button
                        className={"bg-white relative rounded-md border-2 border-gray-400 w-96 p-2 mt-4 hover:bg-gray-300" + (item.userChallenges && item.userChallenges[0]?.correct ? ' !bg-green-400 !border-0' : '')}
                        disabled={item.userChallenges && item.userChallenges[0]?.correct}
                        onClick={() => redirectChallenge(item.id)}
                        key={item.id}
                    >
                        <h1 className="pb-1 font-medium text-lg">{item.title}</h1>

                        <span className="text-stone-500 text-start w-1/2 block">{item.description.substring(0, 15)}...</span>
                        <small className="absolute bottom-1 right-1 text-slate-600">{item._count.userChallenges} Resoluções</small>
                    </button>
                ))}
            </main>

            <nav className="w-full flex justify-center mt-4 mb-3">
                <ul className="flex items-center -space-x-px h-8 text-sm">
                    <li>
                        <button disabled={(page - 1 <= 0) || loading} onClick={() => page - 1 > 0 && setPage(page - 1)} className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
                            <span className="sr-only">Anterior</span>
                            <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </button>
                    </li>
                    {page - 2 > 0 ? (
                        <li>
                            <button disabled={loading} onClick={() => setPage(page - 2)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{page - 2}</button>
                        </li>
                    ) : (
                        null
                    )}
                    {page - 1 > 0 ? (
                        <li>
                            <button disabled={loading} onClick={() => setPage(page - 1)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{page - 1}</button>
                        </li>
                    ) : (
                        null
                    )}
                    <li>
                        <button disabled aria-current="page" className="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">{page}</button>
                    </li>
                    {page + 1 <= (data?.pageCount || 1) ? (
                        <li>
                            <button disabled={loading} onClick={() => setPage(page + 1)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{page + 1}</button>
                        </li>
                    ) : (
                        null
                    )}
                    {page + 2 <= (data?.pageCount || 1) ? (
                        <li>
                            <button onClick={() => setPage(page + 2)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{page + 2}</button>
                        </li>
                    ) : (
                        null
                    )}
                    <li>
                        <button disabled={(page + 1 > (data?.pageCount || 1)) || loading} onClick={() => setPage(page + 1)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">
                            <span className="sr-only">Próximo</span>
                            <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
})
