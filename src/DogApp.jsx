import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API_URL = "https://dogapi.dog/api/v2";

async function fetchBreeds() {
  const response = await fetch(`${API_URL}/breeds`);

  if (!response.ok) {
    throw new Error("Failed to fetch dog breeds");
  }

  return response.json();
}

async function fetchBreedDetails(id) {
  const response = await fetch(`${API_URL}/breeds/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch breed details");
  }

  return response.json();
}

async function fetchFacts() {
  const response = await fetch(`${API_URL}/facts`);

  if (!response.ok) {
    throw new Error("Failed to fetch dog facts");
  }

  return response.json();
}

async function fetchGroups() {
  const response = await fetch(`${API_URL}/groups`);

  if (!response.ok) {
    throw new Error("Failed to fetch dog groups");
  }

  return response.json();
}

function DogApp() {
  const [selectedBreedId, setSelectedBreedId] = useState(null);

  const breedsQuery = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
  });

  const breedDetailsQuery = useQuery({
    queryKey: ["breedDetails", selectedBreedId],
    queryFn: () => fetchBreedDetails(selectedBreedId),
    enabled: !!selectedBreedId,
  });

  const factsQuery = useQuery({
    queryKey: ["facts"],
    queryFn: fetchFacts,
  });

  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  return (
    <div className="app-container">
      <h1>Dog API TanStack Query App</h1>
      <p>
        This app uses TanStack Query to fetch dog breeds, breed details, facts,
        and groups.
      </p>

      <section className="card">
        <h2>Dog Breeds</h2>

        {breedsQuery.isPending && <p className="loading">Loading breeds...</p>}

        {breedsQuery.isError && (
          <p className="error">Error: {breedsQuery.error.message}</p>
        )}

        {breedsQuery.isSuccess && (
          <div className="breed-list">
            {breedsQuery.data.data.map((breed) => (
              <button
                key={breed.id}
                onClick={() => setSelectedBreedId(breed.id)}
              >
                {breed.attributes.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Breed Details</h2>

        {!selectedBreedId && <p>Select a breed to see more details.</p>}

        {breedDetailsQuery.isPending && selectedBreedId && (
          <p className="loading">Loading breed details...</p>
        )}

        {breedDetailsQuery.isError && (
          <p className="error">Error: {breedDetailsQuery.error.message}</p>
        )}

        {breedDetailsQuery.isSuccess && (
          <div className="details">
            <h3>{breedDetailsQuery.data.data.attributes.name}</h3>
            <p>{breedDetailsQuery.data.data.attributes.description}</p>

            <p>
              <strong>Life Expectancy:</strong>{" "}
              {breedDetailsQuery.data.data.attributes.life?.min} -{" "}
              {breedDetailsQuery.data.data.attributes.life?.max} years
            </p>

            <p>
              <strong>Male Weight:</strong>{" "}
              {breedDetailsQuery.data.data.attributes.male_weight?.min} -{" "}
              {breedDetailsQuery.data.data.attributes.male_weight?.max} kg
            </p>

            <p>
              <strong>Female Weight:</strong>{" "}
              {breedDetailsQuery.data.data.attributes.female_weight?.min} -{" "}
              {breedDetailsQuery.data.data.attributes.female_weight?.max} kg
            </p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Dog Facts</h2>

        {factsQuery.isPending && <p className="loading">Loading facts...</p>}

        {factsQuery.isError && (
          <p className="error">Error: {factsQuery.error.message}</p>
        )}

        {factsQuery.isSuccess &&
          factsQuery.data.data.map((fact) => (
            <p className="fact" key={fact.id}>
              🐶 {fact.attributes.body}
            </p>
          ))}
      </section>

      <section className="card">
        <h2>Dog Groups</h2>

        {groupsQuery.isPending && <p className="loading">Loading groups...</p>}

        {groupsQuery.isError && (
          <p className="error">Error: {groupsQuery.error.message}</p>
        )}

        {groupsQuery.isSuccess && (
          <div className="group-list">
            {groupsQuery.data.data.map((group) => (
              <div className="group-card" key={group.id}>
                <h3>{group.attributes.name}</h3>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DogApp;
