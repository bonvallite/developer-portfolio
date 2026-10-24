import test from "node:test";
import assert from "node:assert/strict";
import { lessons, questions, gradeCssAnswers } from "../lib/css-lab.mjs";

test("educational CSS topics have unique identifiers, categories and examples", () => {
  assert.ok(lessons.length >= 12);
  assert.equal(new Set(lessons.map(x => x.id)).size, lessons.length);
  for (const topic of lessons) {
    assert.ok(topic.title && topic.summary && topic.code && topic.detail);
    assert.ok(["Selectors","Box model","Positioning","Layout","Responsive","Visibility"].includes(topic.category));
  }
});

test("quiz solutions are valid indices and have explanations", () => {
  assert.equal(questions.length, 8);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const q of questions) {
    assert.ok(q.prompt && q.reason && q.options.length >= 2);
    assert.ok(q.correct >= 0 && q.correct < q.options.length);
  }
});

test("grading tracks unanswered questions, all correct answers and wrong answers", () => {
  assert.deepEqual(gradeCssAnswers({}).answered, 0);
  const all = Object.fromEntries(questions.map(q => [q.id, q.correct]));
  const perfect = gradeCssAnswers(all);
  assert.equal(perfect.correct, 8);
  assert.equal(perfect.answered, 8);
  const wrong = {...all, [questions[0].id]: (questions[0].correct + 1) % questions[0].options.length};
  assert.equal(gradeCssAnswers(wrong).correct, 7);
  assert.equal(gradeCssAnswers({...all,[questions[0].id]: 999}).answered, 7);
  assert.throws(() => gradeCssAnswers(null), TypeError);
});
