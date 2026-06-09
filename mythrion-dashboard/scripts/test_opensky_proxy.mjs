import fetch from 'node-fetch';

async function test() {
  const res = await fetch('https://opensky-network.org/api/states/all');
  if (res.ok) {
    const data = await res.json();
    console.log("Total OpenSky flights:", data.states ? data.states.length : 0);
  } else {
    console.log("OpenSky error:", res.status, await res.text());
  }
}
test();
