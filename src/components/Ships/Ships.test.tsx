import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Ships from "./Ships";
import { PlayerShip } from "../../types/types";
import { SHIPS } from "../../constants/constants";

describe("Ships Component", () => {
	const PlayerShipsMock: PlayerShip[] = SHIPS.map((ship) => ({
		...ship,
		pending: false,
		done: false,
	}));

	const mockPropsFalse = {
		ships: PlayerShipsMock,
		onClickShip: jest.fn(),
		onClickStartGame: jest.fn(),
		playerShipsDone: false,
		playersReady: false,
	};
	const mockPropsTrue = {
		ships: PlayerShipsMock,
		onClickShip: jest.fn(),
		onClickStartGame: jest.fn(),
		playerShipsDone: false,
		playersReady: true,
	};

	it("renders without crashing", () => {
		render(<Ships {...mockPropsFalse} />);
		expect(screen.getByText("Ships")).toBeInTheDocument();
	});

	it("calls onClickShip when a ship is clicked", () => {
		render(<Ships {...mockPropsFalse} />);
		fireEvent.click(screen.getByText("Carrier"));
		expect(mockPropsFalse.onClickShip).toHaveBeenCalled();
	});

	it("calls onClickStartGame when start button is clicked", () => {
		render(<Ships {...mockPropsTrue} />);
		fireEvent.click(screen.getByText("start"));
		expect(mockPropsTrue.onClickStartGame).toHaveBeenCalled();
	});

	it("disables start button when players are not ready", () => {
		render(<Ships {...mockPropsFalse} />);
		expect(screen.getByText("start")).toBeDisabled();
	});
});

describe("createArray method", () => {
	const createArray = (number: number) => {
		return Array.from(new Array(number));
	};
	test("create an array", () => {
		expect(createArray(99)).toHaveLength(99);
	});
	test("create an array of length 1", () => {
		expect(createArray(1)).toHaveLength(1);
	});
});
