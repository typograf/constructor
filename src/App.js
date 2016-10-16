import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Typograf from 'typograf';
import { getText } from './Texts';
import './App.css';

var rules = Typograf.prototype._rules;
rules
    .sort(function(a, b) {
        return a.name > b.name ? 1 : -1;
    })
    .forEach(function(rule) {
        rule.checked = !rule.disabled;
    });

class App extends Component {
    constructor(props) {
        super(props);

        [
            'onChangeAll',
            'onChangeLang',
            'onChangeNameFilter',
            'onChangeNameTitle',
            'onChangeTitleFilter',
            'onCheckRule',
            'onClickTextarea',
            'onDefault'
        ].forEach(function(event) {
            this[event] = this[event].bind(this);
        }, this)

        var defaultLang = 'ru';
        this.state = {
            selectedAll: false,
            lang: defaultLang,
            langs: [
                {
                    text: 'Ru',
                    value: 'ru'
                },
                {
                    text: 'En',
                    value: 'en'
                }
            ],
            code: this.getSource([], [], defaultLang),
            rules: rules,
            nameFilter: '',
            titleFilter: ''
        };
    }

    onChangeLang(e) {
        if(e.target.checked) {
            this.setState({lang: e.target.value}, function() {
                this.updateSource();
            });
        }
    }

    onDefault() {
        this.state.rules.forEach(function(rule) {
            rule.checked = rule.disabled ? false : true;
        });

        this.setState({
            selectedAll: false,
            rules: rules
        }, function() {
            this.updateSource();
        });
    }

    onCheckRule(e) {
        var name = e.target.dataset.id,
            checkedCount = 0,
            count = 0;

        this.state.rules.forEach(function(rule) {
            if(rule.name === name) {
                rule.checked = e.target.checked;
            }

            if(rule.checked) {
                checkedCount++;
            }

            count++;

            return rule;
        });

        this.setState({
            selectedAll: count === checkedCount,
            rules: this.state.rules
        }, function() {
            this.updateSource();
        });
    }

    onClickTextarea() {
        ReactDOM.findDOMNode(this.refs.textarea).select();
    }

    onChangeNameFilter(e) {
        this.onChangeNameTitle(e.target.value, this.state.titleFilter);
    }

    onChangeTitleFilter(e) {
        this.onChangeNameTitle(this.state.nameFilter, e.target.value);
    }

    onChangeNameTitle(nameFilter, titleFilter) {
        this.state.rules.forEach(function(rule) {
            var isHidden = false,
                name = rule.name;

            if (nameFilter && name.toLowerCase().search(nameFilter.toLowerCase()) === -1) {
                isHidden = true;
            }

            if (titleFilter && this.getTitle(name).toLowerCase().search(titleFilter.toLowerCase()) === -1) {
                isHidden = true;
            }

            rule.hidden = isHidden;
        }, this);

        this.setState({
            nameFilter: nameFilter,
            titleFilter: titleFilter,
            rules: this.state.rules
        });
    }

    onChangeAll(e) {
        var checked = e.target.checked;

        this.state.rules.forEach(function(rule) {
            rule.checked = checked;
        });

        this.setState({
            selectedAll: checked,
            rules: this.state.rules
        }, function() {
            this.updateSource();
        });
    }

    render() {
        var index = 0;

        function createLang(lang) {
            return (<label key={lang.value}>
                <input
                    name="lang"
                    type="radio"
                    onChange={this.onChangeLang}
                    checked={this.state.lang === lang.value}
                    value={lang.value}
                />{lang.text}
            </label>);
        }

        function createRule(rule) {
            var title = this.getTitle(rule.name),
                cls = [];

            if (rule.checked) {
                cls.push('rules__row_checked');
            }

            if (rule.hidden) {
                cls.push('rules__row_hidden');
            } else {
                index++;
            }

            return (
                <tr
                    className={cls.join(' ')}
                    key={rule.name}
                >
                    <td className="rules__control">
                        <input
                            type="checkbox"
                            data-id={rule.name}
                            className="rules__checkbox"
                            checked={rule.checked}
                            onChange={this.onCheckRule}
                            autoComplete="off"
                        />
                    </td>
                    <td className="rules__num">{index}.</td>
                    <td className="rules__name">{rule.name}</td>
                    <td className="rules__title">{title}</td>
                </tr>
            );
        }

        return (
            <div>
                <h1>{this.text('title')}</h1>
                <div className="controls">
                    <button className="controls__default" onClick={this.onDefault}>{this.text('defaultRules')}</button>
                    <div className="controls__langs">{this.state.langs.map(createLang, this)}</div>
                </div>
                <div className="result">
                {this.text('result')}:<br />
                    <textarea
                        className="result__textarea"
                        ref="textarea"
                        onClick={this.onClickTextarea}
                        readOnly="readonly"
                        autoComplete="off"
                        rows="10"
                        value={this.state.code}
                    ></textarea>
                </div>
                <table className="rules">
                    <thead>
                        <tr>
                            <th className="rules__control">
                                <input
                                    type="checkbox"
                                    onChange={this.onChangeAll}
                                    checked={this.state.selectedAll}
                                />
                            </th>
                            <th className="rules__num">
                            </th>
                            <th className="rules__name">
                                <input
                                    className="rules__name-filter"
                                    type="text"
                                    placeholder={this.text('nameFilterPlaceholder')}
                                    value={this.state.nameFilter}
                                    onChange={this.onChangeNameFilter}
                                />
                            </th>
                            <th className="rules__title">
                                <input
                                    className="rules__title-filter"
                                    type="text"
                                    placeholder={this.text('titleFilterPlaceholder')}
                                    value={this.state.titleFilter}
                                    onChange={this.onChangeTitleFilter}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.rules.map(createRule, this)}
                    </tbody>
                </table>
            </div>
        );
    }

    getSource(enabled, disabled, lang) {
        var text = '// Typograf v' + Typograf.version + '\nvar t = new Typograf({lang: \'' + lang + '\'});\n',
            pad = '\n    ',
            enable = [],
            disable = [];

        if (enabled.length) {
            enabled.sort().forEach(function(rule) {
                enable.push('"' + rule + '"');
            });

            text += 't.enable([' + enable.join(',' + pad) + ']);\n';
        }

        if (disabled.length) {
            disabled.sort().forEach(function(rule) {
                disable.push('"' + rule + '"');
            });

            text += 't.disable([' + disable.join(',' + pad) + ']);\n';
        }

        return text;
    }

    text(id) {
        return getText(this.state.lang, id);
    }

    updateSource() {
        var enabled = [],
            disabled = [];

        this.state.rules.forEach(function(rule) {
            var ruleName = rule.name;
            if(rule.checked && rule.disabled) {
                enabled.push(ruleName);
            }

            if(!rule.checked && !rule.disabled) {
                disabled.push(ruleName);
            }
        });

        this.setState({
            code: this.getSource(enabled, disabled, this.state.lang)
        });
    }

    getTitle(name) {
        var obj = Typograf.titles[name],
            title = obj[this.state.lang] || obj.common;

        return title;
    }
}

export default App;