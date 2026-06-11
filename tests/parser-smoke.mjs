import assert from "node:assert/strict";
import { createDrawingPlan } from "../app-core.mjs";

const canvas = { width: 1280, height: 760 };

const cases = [
  ["draw a sunset background with mountains and a river", ["background", "sun", "mountains", "river"]],
  ["draw a red circle at center radius 90", ["circle"]],
  ["draw five yellow stars at the top", ["star", "star", "star", "star", "star"]],
  ["make a forest with three trees and a moon", ["background", "moon", "star", "tree", "tree", "tree"]],
  ["write hello near the bottom", ["text"]],
  ["画一个蓝天背景，有三朵白云和四朵粉色花", ["background", "cloud", "cloud", "cloud", "flower", "flower", "flower", "flower"]],
  ["在左边画蓝色房子", ["house"]],
  ["在下方写你好", ["text"]],
  ["clear canvas", ["clear"]]
];

for (const [command, expectedTypes] of cases) {
  const plan = createDrawingPlan(command, canvas);
  const types = plan.operations.map((item) => item.type);
  for (const type of expectedTypes) {
    assert.ok(types.includes(type), `${command} should include ${type}; got ${types.join(", ")}`);
  }
  if (command.includes("sunset background")) {
    assert.ok(!types.includes("circle"), `background should not trigger circle; got ${types.join(", ")}`);
  }
  if (command.includes("写你好")) {
    assert.equal(plan.operations.find((item) => item.type === "text")?.label, "你好");
    assert.ok(!types.includes("rect"), `position word 下方 should not trigger rect; got ${types.join(", ")}`);
  }
  if (command.includes("蓝天背景")) {
    assert.equal(types.filter((type) => type === "cloud").length, 3);
    assert.equal(types.filter((type) => type === "flower").length, 4);
  }
  assert.ok(plan.confidence > 0.45, `${command} should have usable confidence`);
}

console.log("parser smoke checks passed");
