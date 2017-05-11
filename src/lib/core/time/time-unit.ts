export interface TimeUnit {
  unitKey: string
  logicalMax: number
  fullLabel: string
  label: string
  momentKey: 'd' | 'h' | 'm' | 's' | 'ms',
  orderIndex: number
  separatorSuffix: string
  next: string
  previous: string
}


export const TimeUnitSort = (b, a) => {
  return a.orderIndex - b.orderIndex
}

export const TimeUnits = {
  day: <TimeUnit>{
    unitKey:         'day',
    fullLabel:       'Day',
    label:           'day',
    separatorSuffix: 'd ',
    logicalMax:      7,
    momentKey:       'd',
    orderIndex:      40,
    next:            'h',
    previous:        null
  },
  h:   <TimeUnit>{
    unitKey:         'h',
    fullLabel:       'Hour',
    label:           'hour',
    separatorSuffix: ':',
    logicalMax:      23,
    momentKey:       'h',
    orderIndex:      30,
    next:            'min',
    previous:        'day'
  },
  min: <TimeUnit>{
    unitKey:         'min',
    fullLabel:       'Minute',
    label:           'min',
    separatorSuffix: ':',
    logicalMax:      59,
    momentKey:       'm',
    orderIndex:      20,
    next:            's',
    previous:        'h'
  },
  s:   <TimeUnit>{
    unitKey:         's',
    fullLabel:       'Second',
    label:           'sec',
    separatorSuffix: '.',
    logicalMax:      59,
    momentKey:       's',
    orderIndex:      10,
    next:            'ms',
    previous:        'min'
  },
  ms:  <TimeUnit>{
    unitKey:         'ms',
    fullLabel:       'Millisecond',
    label:           'ms',
    separatorSuffix: '',
    logicalMax:      999,
    momentKey:       'ms',
    orderIndex:      0,
    next:            null,
    previous:        's'
  },
}

export const TimeUnitKeySort = (b, a) => {
  return TimeUnits[a].orderIndex - TimeUnits[b].orderIndex
}

