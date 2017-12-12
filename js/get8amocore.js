define(['jquery'], function ($) {
    let api = function (widget, controller, dev=false) {
        let self = this;

        /**
         * Возвращает ссылку для обращения на сервер amocore.in
         *
         * @param {string}  method     Экшн-метод этого контроллера
         * @param {Object}  params     Параметры запроса (встарвляются после ? в ссылке)
         *
         * @return {string}
         */
        this.getUrl = function (method, params = {}) {
            params = jQuery.param(params);

            return '/' + '/api.' + (dev ? 'dev-' : '') + 'amocore.in/' + widget.system().subdomain + '/'
                + controller + '/' + method + '/' + widget.get_settings().hash + (params ? '?' + params : '');
        };

        /**
         * Отправляет GET запрос на сервер amocore.in
         *
         * @param method
         * @param params
         */
        this.GET = function (method, params) {
            let url = self.getUrl(method, params);

            return new Promise(function (resole, reject) {
                $.get(url)
                    .done(function (response) {
                        if (!response.success) {
                            widget.throwError(response.error);

                            return reject();
                        }

                        return resole(response.data)
                    })
                    .fail(function () {
                        widget.throwError('Что-то пошло не так при обращении на сервер GET8');

                        return reject();
                    })
            })
        };

        return this;
    };

    return api;
});