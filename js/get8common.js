define(['jquery'], function ($) {
    let common = function (widget) {
        let self = this;

        /**
         * Возвращает уникальный для виджета id для привязки событий.
         * Для всех стилей корневой селектор [id^="<widget_name>"]
         *
         * @example азвание виджета – foo
         * self.id() #foo_widget
         * self.id('bar') #foo_widget_bar
         * self.id('', false) foo_widget
         * self.id('bar', false) foo_widget_bar
         * [id^="foo"] .some_style
         *
         * @param {string}  postfix Постфикс
         * @param {boolean} hash    Необходимо ли использовать hash
         *
         * @return {string}
         */
        this.id = function (postfix = '', hash = true) {
            return (hash ? '#' : '') + widget.params.widget_code + '_widget' + (postfix ? '_' + postfix : '');
        };

        /**
         * Забирает данные с АМО
         *
         * @param {string} entity Сущность из которой забираем
         * @param {Array}  ids    Айдишники элементов
         *
         * @return {Promise}
         */
        this.getAmo = function (entity, ids = []) {
            return new Promise(function (resolve, reject) {
                $.get('https://' + self.system().subdomain + '.amocrm.ru/private/api/v2/json/' + entity + '/list', {
                    id         : ids,
                    USER_LOGIN : self.system().amouser,
                    USER_HASH  : self.system().amohash,
                }).done(function (data) {
                    resolve(data.response);
                }).fail(function () {
                    reject('Что-то полшло не так при получении данных из АМО');
                });
            });
        };

        /**
         * Забирает данные с АМО
         *
         * @param {string} entity Сущность из которой забираем
         * @param {Array}  ids    Айдишники элементов
         *
         * @return {Promise}
         */
        this.getAmo = function (entity, ids = []) {
            return new Promise(function (resolve, reject) {
                $.get('https://' + self.system().subdomain + '.amocrm.ru/private/api/v2/json/' + entity + '/list', {
                    id         : ids,
                    USER_LOGIN : self.system().amouser,
                    USER_HASH  : self.system().amohash,
                }).done(function (data) {
                    resolve(data.response);
                }).fail(function () {
                    self.throwError('Что-то полшло не так при получении данных из АМО');

                    reject();
                });
            });
        };

        /**
         * Вернуть html на основе встроенного twig-шаблона
         *
         * @param {string} template Имя шаблона
         * @param {object} callback Функция, в которой и происходит рендер шаблона
         *
         * @return {string}
         */
        this.getTemplate = function (template, callback) {
            return self.render({
                href      : base_templates + template + '.twig',
                base_path : '/',
                v         : version,
                load      : callback
            }, {});
        };

        /**
         * Возращает тип текущей страницы
         *
         * @return {string}
         */
        this.getArea = function () {
            let area = window.location.pathname;

            // Удаляем последний символ, если это слеш
            if (area.slice(-1) === '/') {
                area = area.substring(0, area.length - 1);
            }

            switch (area) {
                case '/contacts/list/companies':
                    area = 'comlist';
                    break;
                case '/contacts/list/contacts':
                    area = 'clist';
                    break;
                case '/contacts/list':
                    area = 'ccomlist';
                    break;
                case '/leads/list':
                    area = 'llist';
                    break;
                case '/todo/list':
                    area = 'tlist';
                    break;
                case '/leads/add':
                    area = 'lnew';
                    break;
                case '/contacts/add':
                    area = 'cnew';
                    break;
                case '/companies/add':
                    area = 'comnew';
                    break;
                default:
                    switch (true) {
                        case /^\/dashboard/.test(area):
                            area = 'dashboard';
                            break;
                        case /^\/leads\/pipeline\/\d+$/.test(area):
                            area = 'pipeline';
                            break;
                        case /^\/contacts\/detail\/\d+$/.test(area):
                        case /^\/contacts\/details\/\d+$/.test(area):
                            area = 'ccard';
                            break;
                        case /^\/companies\/detail\/\d+$/.test(area):
                        case /^\/companies\/details\/\d+$/.test(area):
                            area = 'comcard';
                            break;
                        case /^\/leads\/detail\/\d+$/.test(area):
                        case /^\/leads\/details\/\d+$/.test(area):
                            area = 'lcard';
                            break;
                        case /^\/customers\/detail\/\d+$/.test(area):
                        case /^\/customers\/details\/\d+$/.test(area):
                            area = 'cucard';
                            break;
                        case /^\/settings\/widgets$/.test(area):
                            area = 'settings';
                            break;
                        case /^\/todo\/calendar\/month$/.test(area):
                            area = 'calmonth';
                            break;
                        case /^\/todo\/calendar\/week$/.test(area):
                            area = 'calweek';
                            break;
                        case /^\/todo\/calendar\/day$/.test(area):
                            area = 'calday';
                            break;
                        case /^\/settings\/pay$/.test(area):
                            area = 'pay';
                            break;
                        default:
                            area = false;
                            break;
                    }
                    break;
            }

            return area;
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
                header : self.get_settings().widget_code, //код виджета
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

    return common;
});