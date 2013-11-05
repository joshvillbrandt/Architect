from django.db import models
from django.contrib.auth.models import User

########################################################################################
# parts
########################################################################################
class RootPart(models.Model):
    name = models.CharField(max_length=255, unique=True) # like "0012345-501"
    description = models.CharField(max_length=255) # like "My Component"
    summary = models.TextField(blank=True)
    def __unicode__(self):
        return self.name + ' (' + self.description + ')'
    def save(self, *args, **kwargs):
        if not self.pk:
            super(Part, self).save(*args, **kwargs)
            self.Part_set.create(name='1')
            
        else:
            super(Part, self).save(*args, **kwargs)

class Part(models.Model):
    root_part = models.ForeignKey(RootPart)
    name = models.CharField(max_length=255) # like "A" for a My Component rev A
    shape_json = models.TextField(blank=True) # enclosure shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    def __unicode__(self):
        return self.root_part.__unicode__() + ' ' + self.name

########################################################################################
# connectors
########################################################################################

class ConnectorSeries(models.Model):
    name = models.CharField(max_length=255, unique=True) # like "MIL-DTL-D38999"
    summary = models.TextField(blank=True)
    def __unicode__(self):
        return self.name

class ConnectorSize(models.Model):
    connector_series = models.ForeignKey(ConnectorSeries)
    name = models.CharField(max_length=255) # like "A/9" for an A shell

    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorType(models.Model):
    connector_series = models.ForeignKey(ConnectorSeries)
    name = models.CharField(max_length=255) # like "Plug" or "Receptacle, Board Mount", or "Receptacle, Jam Nut" 
    mount = none, wall mount, jam nut, board mount
    gender plug, Receptacle, genderless
    isGenderless
    isPlug
    harnessable
    max_connections = models.IntegerField() # usually 1, 0 for infinite connectors, >1 for a specific maximum (this is for ring terminals and lugs)
    shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorKey(models.Model):
    connector_series = models.ForeignKey(ConnectorSeries)
    name = models.CharField(max_length=255) # like "11/13/15 N" for normal keying for B, C, and D size connectors
    isUniversal = models.BooleanField() # true if this key type can mate with all key types
    shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    plug shape_json
    Receptacle shape_json
    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorInsert(models.Model):
    connector_series = models.ForeignKey(ConnectorSeries)
    name = models.CharField(max_length=255) # like "9-35 Pins" for an A shell 35 insert
    shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorContactType(models.Model):
    connector_series = models.ForeignKey(ConnectorSeries)
    name = models.CharField(max_length=255) # like "22D Pin"
    shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorContactInstance(models.Model):
    connector_type = models.ForeignKey(ConnectorInsert)
    normal_connector_contact_type = models.ForeignKey(ConnectorContactType)
    flipped_connector_contact_type = models.ForeignKey(ConnectorContactType)
    name = models.CharField(max_length=255) # like "1"
    order = models.IntegerField() # this enable easy sorting from the database for contacts named like a...zA...Zaa...zzAA...ZZ
    normal_position_json = models.TextField(blank=True) # x,y position from center of connector in inches "{"x":-0.012,"y":0.045}" (front face of pin insert)
    normal_position_json = models.TextField(blank=True) # x,y position from center of connector in inches "{"x":-0.012,"y":0.045}" (front face of socket insert)
    def __unicode__(self):
        return self.connector_insert.__unicode__() + ' > ' + self.name

class ConnectorType(models.Model):
    # series
    # mounting # like "Wall Mount" or "Board Mount" or "Jam Nut" or "Plug"
    # material # like "Aluminum shell, electroless nickle finish"
    # shell_type # like "Plug" or "Receptacle"
    # shell_size # like "9/A" or "11/B"
    # insert arrangement
    # list of pins for each contact in arrangement
    # key

    need a table for any field which we don't know all of the values up front, unless it is a number


    series              table
    max_connections     field
    shell gender        field (plug, Receptacle, genderless)
    shell_size          table (connector series based)
    material            table (no connector series)
    






    gender = Plug, Receptacle, Genderless
    connector_series = models.ForeignKey(ConnectorSeries)
    connector_shell = models.ForeignKey(ConnectorShell, blank=True, null=True)
    connector_key = models.ForeignKey(ConnectorKey, blank=True, null=True)
    connector_insert = models.ForeignKey(ConnectorInsert, blank=True, null=True)
    flipped_insert # the D38999 convention is that ""
    name = models.CharField(max_length=255) # like "D38999/24FE35PN"
    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorInstance(models.Model):
    part = models.ForeignKey(Part)
    connector_type = models.ForeignKey(ConnectorType)
    name = models.CharField(max_length=255) # like "J1"
    description = models.CharField(max_length=255) # like "String A - Power"
    position_json = models.TextField(blank=True) # x,y position from center of connector in inches "{"x":-0.012,"y":0.045}"
    def __unicode__(self):
        return self.name

########################################################################################
# channels
########################################################################################
class ChannelType(models.Model):
    name = models.CharField(max_length=255, unique=True) # like "RS422, Asynchronous"
    summary = models.TextField(blank=True)
    def __unicode__(self):
        return self.name

class ChannelSignalType(models.Model):
    channel_type = models.ForeignKey(ChannelType)
    name = models.CharField(max_length=255) # like "TX-P"
    order = models.IntegerField() # description is always "1"
    def __unicode__(self):
        return self.channel_type.__unicode__() + ' [' + self.name + ']'

class ChannelInstance(models.Model):
    part = models.ForeignKey(Part)
    channel_type = models.ForeignKey(ChannelType)
    name = models.CharField(max_length=255) # like "0"
    note = models.TextField(blank=True)
    def __unicode__(self):
        return self.part.__unicode__() + ' > ' + self.channel_type.__unicode__() + ' [' + self.name + ']'

class ChannelSignalInstance(models.Model):
    channel_instance = models.ForeignKey(ChannelInstance)
    channel_signal_type = models.ForeignKey(ChannelSignalType)
    # the signal instance is inherently named by the channel instance name and the channel type signal name
    connector_instance = models.ForeignKey(ConnectorInstance)
    connector_contact_instance = models.ForeignKey(ConnectorContactInstance)
    def __unicode__(self):
        return self.channel_instance.__unicode__() + ' ' + self.channel_signal_type.name

########################################################################################
# part internal relationships
########################################################################################
#class PartInstance(models.Model):
#    parent_part = models.ForeignKey(Part, related_name='parents')
#    part_type = models.ForeignKey(Part)
#    name = models.CharField(max_length=255, unique=True) # like "mycomponent1"
#    note = models.TextField(blank=True)
#    def __unicode__(self):
#        return self.name

#class PartInstanceChannelInstance(models.Model):
#    part_instance = models.ForeignKey(PartInstance)
#    channel_instance = models.ForeignKey(ChannelInstance)

#class ChannelMate(models.Model):
#    channels = models.ManyToManyField(PartInstanceChannelInstance)

########################################################################################
# model history
########################################################################################
#class PartHistory(models.Model):
#    part = models.ForeignKey(Part)
#    version = models.IntegerField()
#    user = models.ForeignKey(User)
#    timestamp = models.DateTimeField(auto_now=True)
#    comment = models.TextField()
    
#    def __unicode__(self):
#        return self.name

#class PartHistoryData(models.Model):
#    part_history = models.ForeignKey(PartHistory)
#    model = models.CharField(max_length=255)
#    field = models.CharField(max_length=255)
#    value = models.TextField()
#    new = models.BooleanField()
#    def __unicode__(self):
#        return self.name

# history
# model
# model_id
# data # serialized
# previous_history # can be null if new
