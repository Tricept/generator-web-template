var fs = require('fs'),
    generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    prompting: function() {
        var done = this.async();
        var prompts = [{
            type: 'input',
            name: 'projectName',
            message: 'Wie lautet der Projektname?',
            default: this.appname
        }, {
            type: 'list',
            name: 'cssPreprocessor',
            message: 'Welchen CSS-Preprozessor möchtest du verwenden?',
            choices: ['LESS', 'SASS'],
            default: 'LESS'
        }, {
            type: 'checkbox',
            name: 'styleLibraries',
            message: 'Welche Style-Bibliotheken möchtest du verwenden?',
            choices: ['Bootstrap']
        }];
        this.prompt(prompts, function(answers) {
            this.projectName = answers.projectName;
            this.cssPreprocessor = answers.cssPreprocessor;
            this.useBootstrap = answers.styleLibraries.indexOf('Bootstrap') >= 0;
            done();
        }.bind(this));
    },
    _wirteGitIgnore: function() {
        this.fs.copyTpl(
            this.templatePath('_gitignore'),
            this.destinationPath('.gitignore')
        );
    },
    _writePackage: function() {
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {'projectName': this.projectName}
        );
    },
    _writeBower: function() {
        this.fs.copyTpl(
            this.templatePath('_bower.json'),
            this.destinationPath('bower.json'),
            {'projectName': this.projectName}
        );
    },
    _writeGulp: function() {
        this.fs.copyTpl(
            this.templatePath('_gulpfile.js'),
            this.destinationPath('gulpfile.js'),
            {'cssPreprocessor': this.cssPreprocessor}
        );
    },
    _writeStyles: function() {
        var file = null;
        if(this.cssPreprocessor == 'LESS') file = 'main.less';
        else if(this.cssPreprocessor == 'SASS') file = 'main.scss';
        this.fs.copyTpl(
            this.templatePath('template/styles/' + file),
            this.destinationPath('template/styles/' + file),
            {'useBootstrap': this.useBootstrap}
        );
    },
    _writeHtml: function() {
        this.fs.copyTpl(
            this.templatePath('template/index.html'),
            this.destinationPath('template/index.html'),
            {'projectName': this.projectName}
        );
    },
    writing: function() {
        this._wirteGitIgnore();
        this._writePackage();
        this._writeBower();
        this._writeGulp();
        this._writeStyles();
        this._writeHtml();
    },
    _installNpmDependencies: function() {
        var dependencies = ['gulp', 'gulp-plumber', 'gulp-cssmin', 'gulp-watch', 'gulp-connect'];
        if(this.cssPreprocessor == 'LESS') dependencies.push('gulp-less');
        else if(this.cssPreprocessor == 'SASS') dependencies.push('gulp-sass');
        this.npmInstall(dependencies, {'saveDev': true});
    },
    _installBowerDependencies: function() {
        var dependencies = [];
        if(this.cssPreprocessor == 'LESS' && this.useBootstrap) dependencies.push('bootstrap');
        else if(this.cssPreprocessor == 'SASS' && this.useBootstrap) dependencies.push('bootstrap-sass');
        this.bowerInstall(dependencies, {'save': true});
    },
    install: function() {
        this._installNpmDependencies();
        this._installBowerDependencies();
    }
});
