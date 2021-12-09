/**
 * The goal of this file or this module is to contain a couple of
 * functions that we reuse over and over in the project
 */

import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

/**
 * Return a new promise, which will rejext after a certain number if seconds.
 * There will be a race between the fetech function and this timeout function,
 * whatever occurs first will win the race.
 *
 * We passed 10 seconds in timeout(), after that time has passed, the promise
 * rejected with the an error message.
 *
 * As soon as any promises in the race() reject or fulfills, then that promise
 * will become the winner
 */
const timeout = function (second) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${second} second`));
    }, second * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    //fetch will return a promise, since this is async function, we can await
    //for this promise, basically stop code execution at this point (but it runs
    //in the background) so we are not blocking the main thread of execution here
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    //once we have the result we need to convert it to json. Json method is available
    //on all response objects. res object is what the fetch returns back. when we
    //call json() on res, it will return another promise and we have to await again.
    //Then we get our data stored to the data variable
    const data = await res.json();

    //coming from the respond of server if there is error in the request of client
    if (!res.ok) throw new Error(`${data.message} Bad Request (${res.status})`);

    //This data will become the resolved value of this promise
    return data; //return (resolved promise)
  } catch (error) {
    //throw this error to another async function like in the model module
    throw error; //throw (rejected promise)
  }
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} Bad Request (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: "POST", //Send the data to the API
      //Infomation about the request itself (specify the request)
      headers: {
        //We tell the API the data we going to send is JSON format
        "Content-Type": "application/json",
      },
      //The payload of the request (The DATA we want to send)
      body: JSON.stringify(uploadData), //Convert the data to JSON
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} Bad Request (${res.status})`);
    return data; //return (resolved promise)
  } catch (error) {
    throw error; //throw (rejected promise)
  }
};
