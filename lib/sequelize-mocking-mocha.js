/**
 * Using SequelizeMocking with mocha easily
 *
 * @module lib/sequelize-mocking-mocha
 * @exports sequelizeMochingMocha
 * @version 0.1.0
 * @since 0.1.0
 * @author Julien Roche
 */

'use strict';

// Imports
const _ = require('lodash');
const SequelizeMocking = require('./sequelize-mocking');

/**
 * @callback SequelizeMockingCallback
 * @param {Sequelize} mockedSequelize
 */

/**
 * @name sequelizeMochingMocha
 * @param {Sequelize} originalSequelize
 * @param {string} [fixtureFilePath]
 * @param {SequelizeMockingOptions} [options]
 * @param {SequelizeMockingCallback} [callback]
 */
module.exports = function (originalSequelize, fixtureFilePath, options, callback) {
    let beforeEach = global.beforeEach ? global.beforeEach : null;
    let afterEach = global.afterEach ? global.afterEach : null;

    if (beforeEach && afterEach) {
        let mockedSequelize = null;

        beforeEach(function (done) {
            let createFunc = _.partialRight(fixtureFilePath ? SequelizeMocking.createAndLoadFixtureFile : SequelizeMocking.create, options);

            createFunc(originalSequelize, fixtureFilePath)
                .then(function (sequelizeInstance) {
                    mockedSequelize = sequelizeInstance;

                    if (callback) {
                        callback(mockedSequelize);
                    }
                })
                .then(function () {
                    done();
                })
                .catch(done);
        });

        afterEach(function (done) {
            SequelizeMocking
                .restore(mockedSequelize, options)
                .then(function () {
                    if (callback) {
                        callback(mockedSequelize);
                    }
                })
                .then(function () {
                    done();
                })
                .catch(done);
        });
    }
};
