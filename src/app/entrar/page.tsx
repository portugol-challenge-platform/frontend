"use client"

import { API_URL } from "@/config";
import { AuthContext } from "@/contexts/authContext";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenCleanned, setTokenCleanned] = useState<boolean>(false);

  const { token, setToken, loading: tokenLoading } = useContext(AuthContext);

  const signIn = async (e: any) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const response = await fetch(API_URL + '/auth/signin', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      setToken(data.access_token);
    }
    catch {
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token && tokenCleanned) redirect('/');
  }, [token, tokenCleanned]);

  useEffect(() => {
    if (tokenLoading || tokenCleanned)
      return;

    setToken(null as any);
    setTokenCleanned(true);
  }, [tokenLoading, tokenCleanned]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-24 w-auto"
            src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Instituto_Federal_do_Cear%C3%A1_-_Marca_Vertical_2015.svg"
            alt="IFCE"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Entre em sua conta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={signIn}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Nome de usuário
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  onChange={e => setUsername(e.target.value)}
                  value={username}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Senha
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Entrar
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
