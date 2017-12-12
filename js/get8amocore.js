define(['jquery'], function ($) {
    let api = function (subdomain, settings, controller, dev=false) {
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

            return '/' + '/api.' + (dev ? 'dev-' : '') + 'amocore.in/' + subdomain + '/'
                + controller + '/' + method + '/' + settings.hash + (params ? '?' + params : '');
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
                            self.throwError(response.error);

                            return reject();
                        }

                        return resole(response.data)
                    })
                    .fail(function () {
                        self.throwError('Что-то пошло не так при обращении на сервер GET8');

                        return reject();
                    })
            })
        };

        /**
         * Отправляет запрос POST на Amocore
         *
         * @param {string}  method Метод
         * @param {Object}  params Объект параметров
         *
         * @return {Promise}
         */
        this.POST = function (method, params) {
            let url = self.getUrl(method, []);

            return new Promise(function (resole, reject) {
                $.post(url, params)
                    .done(function (response) {
                        if (!response.success) {
                            self.throwError(response.error);

                            return reject();
                        }

                        return resole(response.data)
                    })
                    .fail(function () {
                        self.throwError('Что-то пошло не так при обращении на сервер');

                        return reject();
                    })
            })
        };

        /**
         * Выводит в AMO ошибку
         *
         * @param {string|Array} errors Ошибка или массив ошибок
         */
        this.throwError = function (errors) {
            if (Array.isArray(errors)) {
                errors = errors.join('<br/>');
            }

            let notify = AMOCRM.notifications;
            let n_data = {
                header : settings.widget_code, //код виджета
                text   : '<p>' + errors + '</p>',         //текст уведомления об ошибке
                date   : Math.ceil(Date.now() / 1000)     //дата
            };
            let callbacks = {
                done   : function(){},
                fail   : function(){},
                always : function(){console.log(errors)} //вызывается всегда
            };

            notify.add_error(n_data,callbacks);
        };

        return this;
    };

    return api;
});