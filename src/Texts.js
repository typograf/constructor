var texts = {
    ru: {
        defaultRules: 'По умолчанию',
        result: 'Результирующий код',
        selectAll: 'Выбрать всё',
        title: 'Выберите правила для Типографа',
        nameFilterPlaceholder: 'Фильтр по имени',
        titleFilterPlaceholder: 'Фильтр по описанию'
    },
    en: {
        defaultRules: 'Default',
        result: 'Code',
        selectAll: 'Select all',
        title: 'Select rules for Typograf',
        nameFilterPlaceholder: 'Filter by name',
        titleFilterPlaceholder: 'Filter by title'
    }
};

export function getText(lang, id) { return texts[lang][id]; };
