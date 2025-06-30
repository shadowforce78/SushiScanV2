<script>
  import { getMangas } from "./lib/api";
</script>

<main>
  <h1>SushiScan V2</h1>
  <div class="data">
    <h2>Mangas</h2>
    <ul>
      {#await getMangas()}
        <li>Loading...</li>
      {:then data}
        {#if data && data.mangas && Array.isArray(data.mangas)}
          {#each data.mangas as manga}
            <li>{manga.title} - {manga.alt_title}</li>
          {/each}
        {:else}
          <li>Aucun manga trouvé ou format inattendu</li>
        {/if}
      {:catch error}
        <li>Error loading mangas: {error.message}</li>
      {/await}
    </ul>
  </div>
</main>
