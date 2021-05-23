module.exports = {
    presets: [
        ['@vue/app', {
            polyfills: [
                'es6.promise',
                'es6.symbol',
                'es6.array.iterator',
                'es6.object.assign',
            ],
            useBuiltIns: 'entry',
        }]
    ],
    plugins: [
        [
            'component',

            {
                libraryName: 'element-ui',

                styleLibraryName: 'theme-chalk'
            },

            'syntax-dynamic-import'
        ]
    ]
};
