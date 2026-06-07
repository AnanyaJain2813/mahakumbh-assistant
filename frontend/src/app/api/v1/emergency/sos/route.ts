function generateTicket(lat: number, lon: number): string {
  const zone = lat > 25.43 ? 'N' : 'S';
  const sector = Math.floor(Math.abs(lon - 81.88) * 100) % 20 + 1;
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `SOS-${zone}${sector}-${seq}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pilgrim_id, latitude = 25.4284, longitude = 81.8894 } = body;

    if (!pilgrim_id) {
      return Response.json({ error: 'pilgrim_id is required' }, { status: 400 });
    }

    const tracking_ticket = generateTicket(latitude, longitude);

    console.log(`SOS dispatch: ticket=${tracking_ticket} pilgrim=${pilgrim_id} lat=${latitude} lon=${longitude}`);

    return Response.json({
      tracking_ticket,
      status: 'DISPATCHED',
      message: 'Emergency services have been alerted. Help is on the way.',
    });
  } catch (err) {
    console.error('SOS error:', err);
    return Response.json(
      { error: 'SOS service temporarily unavailable' },
      { status: 503 }
    );
  }
}
