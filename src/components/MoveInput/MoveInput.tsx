export default function MoveInput() {
  return (
    <>
      <h2>Move:</h2>
      <div className="flex gap-4 flex-wrap">
        <label className="flex gap-2">
          <input type="radio" name="move" value="1" /> Rock
        </label>
        <label className="flex gap-2">
          <input type="radio" name="move" value="2" /> Paper
        </label>
        <label className="flex gap-2">
          <input type="radio" name="move" value="3" /> Scissors
        </label>
        <label className="flex gap-2">
          <input type="radio" name="move" value="5" /> Lizard
        </label>
        <label className="flex gap-2">
          <input type="radio" name="move" value="4" /> Spock
        </label>
      </div>
    </>
  );
}
