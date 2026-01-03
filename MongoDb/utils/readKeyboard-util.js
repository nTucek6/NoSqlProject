import readline from 'readline-sync';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function input() {
  await rl.question("Unesi broj: ", (input) => {
    const number = parseInt(input.trim());
    if (!isNaN(number)) {
      console.log("Broj:", number);
      rl.close();
      return number;
    } else {
      console.log("Nije broj!");
    }
    rl.close();
  });
}
