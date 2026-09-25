import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SportFilter from "../components/SportFilter.jsx";

const sports = [
  { id: "football", name: "Football", icon: "⚽" },
  { id: "cricket", name: "Cricket", icon: "🏏" },
];

describe("SportFilter", () => {
  it("renders an 'All sports' pill plus one per sport", () => {
    render(<SportFilter sports={sports} selected={null} onSelect={() => {}} />);
    expect(screen.getByText("All sports")).toBeInTheDocument();
    expect(screen.getByText(/Football/)).toBeInTheDocument();
    expect(screen.getByText(/Cricket/)).toBeInTheDocument();
  });

  it("marks the selected sport as active", () => {
    render(<SportFilter sports={sports} selected="cricket" onSelect={() => {}} />);
    expect(screen.getByText(/Cricket/).closest("button")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/Football/).closest("button")).toHaveAttribute("aria-selected", "false");
  });

  it("calls onSelect with the sport id when clicked", () => {
    const onSelect = vi.fn();
    render(<SportFilter sports={sports} selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText(/Football/));
    expect(onSelect).toHaveBeenCalledWith("football");
  });

  it("calls onSelect with null when 'All sports' is clicked", () => {
    const onSelect = vi.fn();
    render(<SportFilter sports={sports} selected="football" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("All sports"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
