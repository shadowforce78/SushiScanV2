<script>
  import { onMount } from 'svelte';
  import { getMangas } from '../lib/api.js';

  let mangas = [];

  onMount(async () => {
    mangas = await getMangas();
  });
</script>
