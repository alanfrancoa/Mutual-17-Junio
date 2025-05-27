

export default class parser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parseError = (error: any) => {
        const err = error?.response ? error.response : error;
        let message = '';
        try {
            if (typeof err === 'object') {
                if (err.data) {
                    message = typeof err.data !== 'object' ? err.data
                        : err.data.error ? err.data.error
                            : err.data.ExceptionMessage ? err.data.ExceptionMessage
                                : err.data.Message ? err.data.Message
                                    : err.data.messages ? err.data.messages
                                        : err.data.errorInfo ? err.data.errorInfo
                                            : err.data.code && err.data.message ? err.data.code + ' - ' + err.data.message
                                                : err.data.respuesta ? err.data.respuesta.codigo + '-' + err.data.respuesta.descripcion
                                                    : err.data.mensajeError
                                                        ? (err.data.mensajeError.error ? err.data.mensajeError.error : err.data.mensajeError)
                                                        : 'Unknow error';
                }
                else {
                    message = err.message ? err.message
                        : err.error ? err.error
                            : err.ExceptionMessage ? err.ExceptionMessage
                                : err.Message;
                }
            }
            else {
                message = err;
            }

            if (typeof message === 'object') {
                message = JSON.stringify(message);
            }
        } catch (e) {
            message = 'Unknow error';
        }

        message = message === 'Unauthorized' ? 'Unauthorized' : message;
        message = message === 'Network Error' ? 'Network Error' : message;
        message = message.length > 300 ? message.substring(0, 300) + '...' : message;

        return message ? message : '';
    }
}