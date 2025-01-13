function onSuccess(data) {
    return data.map((character) => ({
      ...character,
      isHit: false,
      hit() {
        this.isHit = true;
      },
    }));
  }
  
  function onError(error) {
    console.error("Error fetching heroes:", error);
    throw new Error("Couldn't fetch data");
  }
  
  export async function fetchCharacter() {
    try {
      const response = await fetch("https://akabab.github.io/superhero-api/api/all.json");
      const data = await response.json();
      return onSuccess(data); // `data` here is already the array of character
    } catch (error) {
      return onError(error);
    }
  }
  