import random

# Teamköpfe (Erwachsene)
TEAM_HEADS = ["Božo", "Daniel", "Andi", "Marcel", "Damir"]

# Spieler
PLAYERS = [
    "Alessandro",
    "Maxim",
    "Luka",
    "Mathias",
    "Mayar",
    "Erik",
    "Edin",
    "Amin",
    "Elias",
    "Tarik",
    "Mattia",
    "Matthias G",
    "Jonas",
    "Max",
    "Tijan",
]

def main():
    print("=== Team-Auslosung – Terminal Edition ===\n")
    print("Teamköpfe:")
    for head in TEAM_HEADS:
        print(f"- {head}")
    print("\nDrücke bei jeder Ziehung einfach Enter...\n")

    # Teams vorbereiten
    teams = {head: [] for head in TEAM_HEADS}

    remaining = PLAYERS[:]
    random.shuffle(remaining)
    draw_index = 0

    while remaining:
        input("⏩ Enter für den nächsten Schuss...")

        player = remaining.pop(random.randrange(len(remaining))) if remaining else None
        if not player:
            break

        team_index = draw_index % len(TEAM_HEADS)
        head = TEAM_HEADS[team_index]
        teams[head].append(player)
        draw_index += 1

        print()
        print("⚽️  SCHUSS ... TOR!")
        print(f"➡  {player} geht zu Team {head}\n")
        print("----------------------------------------\n")

    print("\n✅ Alle Spieler sind verteilt.\n")
    print("=== Endgültige Teams ===\n")

    for head in TEAM_HEADS:
        print(f"🔰 Team {head}")
        for i, p in enumerate(teams[head], start=1):
            print(f"  {i}. {p}")
        print()

if __name__ == "__main__":
    main()
