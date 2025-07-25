"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const e = require("effect"),
	L = require("node:readline"),
	u = require("@inquirer/prompts"),
	o = require("@effect/platform"),
	k = require("node:readline/promises");
class d extends e.Context.Tag("CurrentPositionState")() {}
class i extends e.Context.Tag("MazeDataState")() {}
const G = `http://${process.env.API_HOST}:${Number(process.env.API_PORT || "8080")}`,
	m = {
		right: { x: 0, y: 1 },
		down: { x: 1, y: 0 },
		left: { x: 0, y: -1 },
		up: { x: -1, y: 0 },
	},
	R = {
		player: "",
		maze: {
			maze_id: "",
			mazeName: "",
			description: "",
			created_at: "0",
			numCols: 0,
			numRows: 0,
			grid: [
				{ vertical: [!1, !1, !1, !1, !1], horizontal: [!1, !1, !1, !1, !1] },
			],
		},
		gameMode: "",
	};
k.createInterface({ input: process.stdin, output: process.stdout });
const N = () => {
		process.stdout.write("\x1B[H\x1B[2J\x1B[3J");
	},
	_ = {
		buildTopWall: e.pipe(
			i,
			e.Effect.flatMap((c) => e.Ref.get(c)),
			e.Effect.map((c) => {
				const t = c.maze.numCols;
				return `${Array.from({ length: t * 2 + 1 }, (a, f) => (f === 1 ? "    " : f % 2 === 0 ? "+" : "----")).join("")}\r
`;
			}),
		),
		buildVerticalRow: (c, t, a) =>
			e.pipe(
				e.Effect.succeed(c),
				e.Effect.map((f) => {
					let r = [];
					return (
						f.forEach((s, l) => {
							(r = [...r, l === t ? ` ${a} ` : "    "]),
								(r = [...r, s ? " " : "|"]);
						}),
						r
					);
				}),
			),
		buildHorizRow: (c) =>
			e.pipe(
				e.Effect.succeed(c),
				e.Effect.map((t) => {
					let a = [];
					return (
						(a = [
							...a,
							`\r
+`,
						]),
						t.forEach((f, r) => {
							(a = [...a, f ? "    " : "----"]), (a = [...a, "+"]);
						}),
						(a = [
							...a,
							`\r
`,
						]),
						a
					);
				}),
			),
	};
class E extends e.Context.Tag("BuilderMaze")() {
	static Live = E.of(_);
}
class n {
	constructor(t) {
		this.message = t;
	}
	_tag = "GamePlayError";
}
const W = "/player",
	$ = "/maze/:maze_id",
	H = "/maze",
	O = "/maze/metadata";
e.Config.integer("PORT").pipe(e.Config.withDefault(8081));
e.Config.string("HOST").pipe(e.Config.withDefault("localhost"));
const Y = e.Schema.Boolean,
	b = e.Schema.Array(Y),
	q = e.Schema.Struct({ vertical: b, horizontal: b }),
	w = e.Schema.Struct({
		maze_id: e.Schema.String,
		mazeName: e.Schema.String,
		description: e.Schema.String,
		created_at: e.Schema.String,
	}),
	v = e.Schema.Array(w),
	p = e.Schema.Struct({
		...w.fields,
		numCols: e.Schema.Number,
		numRows: e.Schema.Number,
		grid: e.Schema.Array(q),
	});
e.Schema.Array(p);
const X = p
		.omit("grid")
		.pipe(e.Schema.extend(e.Schema.Struct({ grid: e.Schema.String }))),
	B = e.Schema.transform(X, p, {
		encode: (c) => ({ ...c, grid: JSON.stringify(c.grid) }),
		decode: (c) => ({ ...c, grid: JSON.parse(c.grid) }),
	});
e.Schema.Struct({ x: e.Schema.Number, y: e.Schema.Number });
e.Schema.Array(B);
const P = e.Schema.Struct({ x: e.Schema.Number, y: e.Schema.Number });
e.Schema.Struct({ maze: p, currentPosition: P, playerMoves: P });
const V = e.Schema.Struct({
		dx: e.Schema.Number,
		dy: e.Schema.Number,
		currentX: e.Schema.Number,
		currentY: e.Schema.Number,
		maze: p,
	}),
	I = e.Schema.Struct({
		maze: p,
		player: e.Schema.String,
		gameMode: e.Schema.String,
	}),
	J = e.Schema.Struct({
		playerID: e.Schema.String,
		name: e.Schema.String,
		value: e.Schema.String,
		description: e.Schema.String,
	}),
	U = e.Schema.Array(J),
	j = (c) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.bind("newX", (t) => e.Effect.succeed(t.dx + t.currentX)),
			e.Effect.bind("newY", (t) => e.Effect.succeed(t.dy + t.currentY)),
			e.Effect.bind("condition", ({ newX: t, newY: a }) =>
				e.Effect.succeed(
					t < 0 || a < 0 || t >= c.maze.numRows || a >= c.maze.numCols,
				),
			),
			e.Effect.flatMap(({ condition: t }) =>
				t ? e.Effect.fail(new n("Out of bounds")) : e.Effect.succeed(!1),
			),
		),
	F = (c) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.bind("condition", (t) =>
				e.Effect.succeed(
					t.dx === 0 &&
						t.dy === 1 &&
						t.currentY < t.maze.numCols - 1 &&
						!t.maze.grid[t.currentX].vertical[t.currentY],
				),
			),
			e.Effect.flatMap(({ condition: t }) =>
				t ? e.Effect.fail(new n("Wall to the right")) : e.Effect.succeed(!1),
			),
		),
	Z = (c) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.bind("condition", (t) =>
				e.Effect.succeed(
					t.dx === 1 &&
						t.dy === 0 &&
						t.currentX < t.maze.numRows - 1 &&
						!t.maze.grid[t.currentX].horizontal[t.currentY],
				),
			),
			e.Effect.flatMap(({ condition: t }) =>
				t ? e.Effect.fail(new n("Wall below")) : e.Effect.succeed(!1),
			),
		),
	K = (c) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.bind("condition", (t) =>
				e.Effect.succeed(
					t.dx === 0 &&
						t.dy === -1 &&
						t.currentY > 0 &&
						!t.maze.grid[t.currentX].vertical[t.currentY - 1],
				),
			),
			e.Effect.flatMap(({ condition: t }) =>
				t ? e.Effect.fail(new n("Wall to the left")) : e.Effect.succeed(!1),
			),
		),
	Q = (c) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.bind("condition", (t) =>
				e.Effect.succeed(
					t.dx === -1 &&
						t.dy === 0 &&
						t.currentX > 0 &&
						!t.maze.grid[t.currentX - 1].horizontal[t.currentY],
				),
			),
			e.Effect.flatMap(({ condition: t }) =>
				t ? e.Effect.fail(new n("Wall above")) : e.Effect.succeed(!1),
			),
		),
	ee = (c) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.map((t) => ({
				dx: t.playerMoves.x,
				dy: t.playerMoves.y,
				currentX: t.currentPosition.x,
				currentY: t.currentPosition.y,
				maze: t.maze,
			})),
			e.Effect.map((t) => e.Schema.decodeUnknownSync(V)(t)),
		),
	te = (c) =>
		e.pipe(
			ee(c),
			e.Effect.flatMap((t) =>
				j(t).pipe(
					e.Effect.andThen(() => Q(t)),
					e.Effect.andThen(() => Z(t)),
					e.Effect.andThen(() => K(t)),
					e.Effect.andThen(() => F(t)),
				),
			),
			e.Effect.flatMap(() =>
				e.Effect.succeed({
					x: c.currentPosition.x + c.playerMoves.x,
					y: c.currentPosition.y + c.playerMoves.y,
				}),
			),
			e.Effect.catchTag("GamePlayError", (t) => e.Effect.fail(t)),
		),
	ce = (c) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.bind("position", () => e.Ref.get(c.currentPosition)),
			e.Effect.bind("mazeState", () => e.Ref.get(c.maze)),
			e.Effect.map(({ position: t, mazeState: { maze: a } }) =>
				t.x === a.numRows - 1 && t.y === a.numCols - 1
					? e.Effect.succeed("Game Over")
					: e.Effect.fail(new n("Game not over")),
			),
			e.Effect.flatMap((t) => t),
			e.Effect.catchTag("GamePlayError", (t) => e.Effect.succeed(t)),
		),
	ae = (c, t) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.bindTo("gameState"),
			e.Effect.bind("state", ({ gameState: a }) =>
				e.Effect.succeed({ playerMoves: t, ...a }),
			),
			e.Effect.tap(({ state: a }) => A(a)),
			e.Effect.flatMap(({ state: a }) => ce(a)),
		),
	fe = (c) =>
		e.pipe(
			e.Ref.get(c.maze),
			e.Effect.flatMap(({ maze: t }) =>
				Ee(t, c).pipe(
					e.Effect.catchTag("GamePlayError", (a) => e.Effect.fail(a)),
				),
			),
		),
	re = ({ x: c, y: t, maze: { numCols: a, grid: f } }, r) =>
		e.pipe(
			e.Effect.succeed(
				t < a - 1 && f[c].vertical[t] && !r.has(`${c},${t + 1}`),
			),
			e.Effect.flatMap((s) =>
				s
					? e.Effect.succeed({ x: c, y: t + 1, path: [m.right] })
					: e.Effect.succeed(void 0),
			),
		),
	se = ({ x: c, y: t, maze: { numRows: a, grid: f } }, r) =>
		e.pipe(
			e.Effect.succeed(
				c < a - 1 && f[c].horizontal[t] && !r.has(`${c + 1},${t}`),
			),
			e.Effect.flatMap((s) =>
				s
					? e.Effect.succeed({ x: c + 1, y: t, path: [m.down] })
					: e.Effect.succeed(void 0),
			),
		),
	ie = ({ x: c, y: t, maze: { grid: a } }, f) =>
		e.pipe(
			e.Effect.succeed(
				t > 0 && a[c].vertical[t - 1] && !f.has(`${c},${t - 1}`),
			),
			e.Effect.flatMap((r) =>
				r
					? e.Effect.succeed({ x: c, y: t - 1, path: [m.left] })
					: e.Effect.succeed(void 0),
			),
		),
	oe = ({ x: c, y: t, maze: { grid: a } }, f) =>
		e.pipe(
			e.Effect.succeed(
				c > 0 && a[c - 1].horizontal[t] && !f.has(`${c - 1},${t}`),
			),
			e.Effect.flatMap((r) =>
				r
					? e.Effect.succeed({ x: c - 1, y: t, path: [m.up] })
					: e.Effect.succeed(void 0),
			),
		),
	ne = (c, t) =>
		e.pipe(
			e.Effect.all([re(c, t), se(c, t), ie(c, t), oe(c, t)]),
			e.Effect.flatMap((a) => {
				const f = a.filter((r) => r !== void 0);
				return a.length > 0
					? e.Effect.succeed(f)
					: e.Effect.fail(new n("No valid moves available"));
			}),
		),
	pe = ({ visited: c, maze: t, stack: a }) =>
		e.pipe(
			e.Effect.succeed(a.pop()),
			e.Effect.flatMap((f) => {
				if (!f) return e.Effect.succeed([]);
				const { x: r, y: s, path: l } = f;
				if (r === t.numRows - 1 && s === t.numCols - 1)
					return e.Effect.succeed(l);
				const z = `${r},${s}`;
				return c.has(z)
					? e.Effect.succeed([])
					: (c.add(z),
						e.pipe(
							ne({ x: r, y: s, maze: t }, c),
							e.Effect.map((D) => {
								D.forEach((h) => {
									a.push({ x: h.x, y: h.y, path: [...l, ...h.path] });
								});
							}),
						));
			}),
		),
	le = (c) =>
		e.Effect.loop(
			{
				stack: [{ x: 0, y: 0, path: [{ x: 0, y: 0 }] }],
				visited: new Set(),
				maze: c,
			},
			{
				while: ({ stack: t }) => t.length > 0,
				step: (t) => t,
				body: (t) => pe(t),
			},
		),
	Ee = (c, t) =>
		le(c).pipe(
			e.Effect.flatMap((a) => {
				const f = a.find((r) => r !== void 0) || [];
				return e.Effect.succeed(f);
			}),
			e.Effect.flatMap((a) =>
				e.Effect.forEach(a, (f) => ae(t, f).pipe(e.Effect.delay("500 millis"))),
			),
			e.Effect.catchTag("GamePlayError", (a) => e.Effect.fail(a)),
		),
	C = e.Effect.map(o.HttpClient.HttpClient, (c) =>
		c.pipe(
			o.HttpClient.mapRequest(
				e.flow(
					o.HttpClientRequest.acceptJson,
					o.HttpClientRequest.prependUrl(G),
				),
			),
		),
	),
	x = (c, t) =>
		e.Effect.succeed(
			o.HttpClientResponse.matchStatus({
				200: (a) => o.HttpClientResponse.schemaBodyJson(t)(a),
				orElse: (a) => e.Effect.fail(a),
			})(c),
		).pipe(e.Effect.flatMap((a) => a)),
	S = (c, t) =>
		e.pipe(
			C,
			e.Effect.flatMap((a) => a.get(c)),
			e.Effect.flatMap((a) => x(a, t)),
			e.Effect.provide(o.FetchHttpClient.layer),
		),
	de = (c, t, a) =>
		e.pipe(
			C,
			e.Effect.flatMap((f) =>
				f.get(
					Object.entries(t).reduce((r, [s, l]) => r.replace(`:${s}`, l), c),
				),
			),
			e.Effect.flatMap((f) => x(f, a)),
			e.Effect.provide(o.FetchHttpClient.layer),
		),
	ue = {
		getDataMaze: () => S(O, v),
		getMaze: (c) => de($, { maze_id: c }, p),
		getAllMazes: () => S(H, v),
		getAllPlayers: () => S(W, U),
	},
	y = e.Effect.Service()("MazeAPIService", {
		dependencies: [],
		effect: e.Effect.succeed(ue),
	}),
	me = (c) =>
		e.Effect.promise(() =>
			u.select({
				message: "Choose your labyrinth tier:",
				choices: c.map((t) => ({
					name: t.mazeName,
					value: t.maze_id,
					description: t.description,
				})),
			}),
		).pipe(e.Effect.map((t) => t)),
	he = (c) =>
		e.Effect.promise(() =>
			u.select({ message: "Select your player character:", choices: c }),
		).pipe(e.Effect.map((t) => t)),
	Se = e.pipe(
		e.Effect.promise(() =>
			u.select({
				message: "Pick your gameplay mode:",
				choices: ["Assist Mode", "Manual Mode"],
			}),
		),
		e.Effect.map((c) => c),
	),
	ge = y.pipe(
		e.Effect.map((c) => c.getAllPlayers()),
		e.Effect.flatMap((c) => c.pipe(e.Effect.flatMap((t) => he(t)))),
	),
	ye = y.pipe(
		e.Effect.map((c) => ({ maze: c.getDataMaze(), mazeAPI: c })),
		e.Effect.flatMap(({ maze: c, mazeAPI: t }) =>
			c.pipe(
				e.Effect.flatMap((a) => me(a)),
				e.Effect.flatMap((a) => t.getMaze(a)),
			),
		),
	),
	Me = e.pipe(
		e.Effect.promise(() =>
			u.select({
				message: "Do you want to play again?",
				choices: ["Yes", "No"],
			}),
		),
		e.Effect.map((c) => c),
	);
class g extends e.Effect.Service()("Maze", {
	dependencies: [y.Default],
	effect: e.pipe(
		e.Effect.all({
			clear: e.Effect.sync(() => console.clear()),
			player: ge,
			maze: ye,
			gameMode: Se,
		}),
		e.Effect.map(({ player: t, maze: a, gameMode: f }) =>
			e.Schema.decodeUnknownSync(I)({ player: t, maze: a, gameMode: f }),
		),
		e.Effect.tap((t) =>
			e.pipe(
				i,
				e.Effect.flatMap((a) => e.Ref.set(a, t)),
			),
		),
	),
}) {}
e.Layer.mergeAll(g.Default, e.Layer.effect(i, e.Ref.make(R)));
const ze = ({ x: c, y: t }, a) => (c === a ? t : -1),
	be = ({ vertical: c, horizontal: t }, a) =>
		e.pipe(
			e.Effect.all({ builderMaze: E, currentPosition: d, mazeData: i }),
			e.Effect.bind("position", ({ currentPosition: f }) => e.Ref.get(f)),
			e.Effect.bind("maze", ({ mazeData: f }) => e.Ref.get(f)),
			e.Effect.flatMap(({ builderMaze: f, position: r, maze: s }) =>
				e.Effect.all({
					verticalRow: f.buildVerticalRow(c, ze(r, a), s.player),
					horizontalRow: f.buildHorizRow(t),
				}),
			),
			e.Effect.map(({ verticalRow: f, horizontalRow: r }) => ["|", ...f, ...r]),
		),
	ve = e.pipe(
		e.Effect.all({ mazeData: i, builder: E }),
		e.Effect.bind("state", ({ mazeData: c }) => e.Ref.get(c)),
		e.Effect.bind("topWall", ({ builder: c }) => c.buildTopWall),
		e.Effect.bind("mazeLayout", ({ state: { maze: c } }) =>
			e.pipe(
				c.grid,
				e.Effect.forEach(be),
				e.Effect.map((t) => t.flat()),
			),
		),
		e.Effect.map(({ topWall: c, mazeLayout: t }) => [...c, ...t]),
		e.Effect.provideService(E, E.Live),
	),
	A = ({ currentPosition: c, maze: t, playerMoves: a }) =>
		e.pipe(
			e.Effect.all({ currPostion: e.Ref.get(c), mazeVal: e.Ref.get(t) }),
			e.Effect.flatMap(({ currPostion: f, mazeVal: r }) =>
				te({ currentPosition: f, maze: r.maze, playerMoves: a }),
			),
			e.Effect.tap((f) =>
				e.pipe(
					e.Ref.update(c, () => f),
					e.Effect.zip(T({ currentPosition: c, maze: t })),
					e.Effect.zip(Re({ currentPosition: c, maze: t })),
				),
			),
			e.Effect.catchTag("GamePlayError", e.Effect.succeed),
			e.Effect.runPromise,
		),
	Pe = () =>
		Me.pipe(
			e.Effect.map((c) => {
				c === "Yes"
					? M.pipe(e.Effect.runPromise)
					: (console.log("Thank you for playing! Goodbye!"), process.exit());
			}),
		),
	Re = (c) =>
		e.pipe(
			e.Effect.succeed(c),
			e.Effect.bind("position", () => e.Ref.get(c.currentPosition)),
			e.Effect.bind("mazeState", () => e.Ref.get(c.maze)),
			e.Effect.tap(({ position: t, mazeState: { maze: a } }) => {
				t.x === a.numRows - 1 &&
					t.y === a.numCols - 1 &&
					(console.log(
						"Congratulations 🎉 🎉 🎉! You have reached the end of the maze.",
					),
					process.stdin.removeAllListeners("keypress"),
					e.Effect.runPromise(Pe()));
			}),
		),
	we = (c) =>
		e.pipe(
			e.Effect.sync(() => {
				L.emitKeypressEvents(process.stdin),
					process.stdin.setRawMode(!0),
					process.stdin.resume(),
					process.stdin.setMaxListeners(100);
			}),
			e.Effect.flatMap(() =>
				e.Effect.async(() => {
					process.stdin.on("keypress", (t, a) => {
						let f = { x: 0, y: 0 };
						if (t === "") process.exit();
						else {
							switch (a.name) {
								case "up":
									f = { x: -1, y: 0 };
									break;
								case "down":
									f = { x: 1, y: 0 };
									break;
								case "left":
									f = { x: 0, y: -1 };
									break;
								case "right":
									f = { x: 0, y: 1 };
									break;
							}
							A({ playerMoves: f, ...c });
						}
					});
				}),
			),
		),
	T = (c) =>
		e.pipe(
			ve,
			e.Effect.tap(() => N()),
			e.Effect.tap((t) => console.log(t.join(""))),
			e.Effect.provideServiceEffect(i, e.Effect.succeed(c.maze)),
			e.Effect.provideServiceEffect(d, e.Effect.succeed(c.currentPosition)),
		),
	Ce = e.pipe(
		e.Effect.all({ maze: i, currentPosition: d }),
		e.Effect.flatMap((c) =>
			e.pipe(
				e.Ref.get(c.maze),
				e.Effect.flatMap((t) => (t.gameMode === "Assist Mode" ? fe(c) : we(c))),
			),
		),
	),
	xe = e.pipe(
		e.Effect.all({ maze: i, currentPosition: d }),
		e.Effect.tap((c) => T(c)),
		e.Effect.tap(() => Ce),
		e.Effect.provideServiceEffect(d, e.Ref.make({ x: 0, y: 0 })),
	),
	M = g.pipe(
		e.Effect.flatMap(() => xe),
		e.Effect.provide(g.Default),
		e.Effect.provideServiceEffect(i, e.Ref.make(R)),
	);
e.Effect.runPromise(M);
exports.mazeApp = M;
