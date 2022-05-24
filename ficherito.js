/**
 * Problem:
 *
 * Create  a chaining API the same as express uses within a middleware
 * e.g. res.status(200).json({}) // returns a Response
 *
 */

// let;
// const

// var, let, const
//   // hositing
//   let, const
//   // re-assign
//   const

// function declaration
function createSomething() {}

function createRespose() {
  let status;

  const res = {
    status: (code) => {
      status = code;
      return this;
    },
    json: (data) => {
      const obj = { data, status };
      // fetch (... )
      // send requests with obj
      // return new Response(...);
    },
  };
  // returns res
}

function createParser(predicate) {
  const data = {};
  let symbolTree = {};

  return function* test(code) {
    for (const line of code) {
      const a = yield data;
    }
  };
}

const notComment = (str) => !str.startsWith('//');
const readCode = createParser(notComment);
const code = '';
for (const parsed of readCode(code)) {
  console.log(parsed);
}

console.log(createRespose());
