import { WeaponWorker } from '@azulamb/weapn';

const worker = new WeaponWorker();
worker.onrequest = async (args) => {
  return new Response(
    'test',
    {
      status: 200,
    },
  );
};
worker.onPrepared.then(() => {
  console.log('Prepared worker:');
}).catch((error) => {
  console.error(error);
});
