<script>
  import { asset } from '$app/paths';
</script>

<iframe
  src={asset('/data-plotting/index.html')}
  title="Pixel urbani — data plotting"
></iframe>

<style>
  iframe {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    border: 0;
  }
</style>
