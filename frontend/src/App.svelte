<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/api.svelte'
  import { getMangas } from './lib/api';
</script>

<main>
  <h1>SushiScan V2</h1>
  <div class="data">
    <p>{JSON.stringify(getMangas())}</p>
  </div>
</main>
