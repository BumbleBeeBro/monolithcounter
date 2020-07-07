/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

const weatherApp = {
  selectedLocations: {},
  addDialogContainer: document.getElementById('addDialogContainer'),
};

/**
 * Get's the latest forecast data from the network.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getCounterFromNetwork() {
  return fetch(`/counter`)
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return null;
    });
}

/**
 * Get's the cached forecast data from the caches object.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromCache() {
  // CODELAB: Add code to get weather forecast from the caches object.
}

/**
 * Gets the latest weather forecast data and updates each card with the
 * new data.
 */
function updateData() {
  //start spinner
  const counterCard = document.getElementById('counter-template');
  counterCard.querySelector('#data').hidden = true;
  const spinner = counterCard.querySelector('.card-spinner');
    spinner.hidden = false;
    
  getCounterFromNetwork().then((counter) => {
    const counterCard = document.getElementById('counter-template');
    counterCard.querySelector('#free').textContent = counter.free;
    counterCard.querySelector('#occupied').textContent = counter.occupied;
    counterCard.querySelector('#data').hidden = false;
    // If the loading spinner is still visible, remove it.
    const spinner = counterCard.querySelector('.card-spinner');
    if (!spinner.hidden) {
      spinner.hidden = true;
    }
  });
}

/**
 * Initialize the app, gets the list of locations from local storage, then
 * renders the initial data.
 */
function init() {
  // Get the location list, and update the UI.
  updateData();

  // Set up the event handlers for all of the buttons.
  document.getElementById('butRefresh').addEventListener('click', updateData);
}

init();
