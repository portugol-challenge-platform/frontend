"use client"
import { useContext, useEffect } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { io } from 'socket.io-client';
import { AuthContext } from '../contexts/authContext';
import 'react-notifications/lib/notifications.css';
import { API_URL } from '@/config';

export const SocketNotification = () => {
    const { token, loading } = useContext(AuthContext);

    useEffect(() => {
        if (loading) return;

        if (!token) return;

        const socket = io(
            API_URL,
            {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Authorization: 'Bearer ' + token,
                        }
                    }
                }
            }
        );

        socket.on('connect', function () {
            NotificationManager.info('Conectado ao serviço de desafios!\nVocê terá feedback dos seus envios em tempo real!', 'Conectado')

            socket.emit('subscribe', true);
        });

        socket.on('processor', function (...data) {
            console.log('event', ...data);

            switch (data[0]) {
                case 'COMPILING':
                    NotificationManager.info('Compilando código internamente', 'Compilando');
                    break;
                case 'STARTING':
                    NotificationManager.info('Código iniciando a execução', 'Iniciando');
                    break;
                case 'SUCCESS':
                    if (!data[2]?.correct)
                        return NotificationManager.success("A saída do seu código não foi como esperado!", 'Não foi dessa vez!');

                    NotificationManager.success(`Seu código estava correto!`, 'Parabéns!');
                    break;
                case 'ALREADYINQUEUE':
                    NotificationManager.warning('Você já tem um código na fila! Não é possivel submeter 2 códigos ao mesmo tempo', 'Fila');
                    break;
                case 'ERROR':
                    NotificationManager.error('Mensagem: ' + (data[1]?.message || 'Erro desconhecido!'), 'Erro');
                    break;
            }
        });

        socket.on('exception', function (data) {
            NotificationManager.error('Não conectado ao serviço de desafios!\nVocê não terá feedback dos seus envios!', 'Desconectado')
            console.log('event', data);
        });

        socket.on('disconnect', function () {
            console.log('Disconnected');
        });

        return () => { socket.disconnect(); }
    }, [token, loading]);

    return (
        <NotificationContainer />
    );
}